"use server";

import { randomBytes } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────

// How long a PENDING order gets to hold stock before it's treated as
// abandoned and the reservation is released. See Stage 4 notes: this is
// the same shape AliExpress/Stripe use for checkout holds, just enforced
// lazily (on the next order attempt) instead of via a scheduled job.
const RESERVATION_WINDOW_MINUTES = 20;

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface CheckoutItemInput {
  variantId: string;
  quantity: number;
}

export interface GuestCheckoutInput {
  items: CheckoutItemInput[];
  fulfillmentType: "SHIP" | "PICKUP";
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddressLine?: string; // required when fulfillmentType is SHIP
}

export interface CartAvailabilityItem {
  variantId: string;
  requestedQuantity: number;
  availableStock: number;
  currentUnitPrice: number;
  inStock: boolean; // availableStock >= requestedQuantity
}

export interface CartAvailabilityResult {
  items: CartAvailabilityItem[];
  allAvailable: boolean;
}

export type CreateOrderResult =
  | { success: true; orderId: string; trackingToken: string }
  | { success: false; error: string; unavailable?: CartAvailabilityItem[] };

// Thrown from inside the createGuestOrder transaction when one or more
// cart items can't be fulfilled. Using a real Error subclass (rather than
// throwing a plain object) lets the catch block narrow it safely with
// `instanceof`, instead of an unsafe cast.
class CartUnavailableError extends Error {
  unavailable: CartAvailabilityItem[];

  constructor(unavailable: CartAvailabilityItem[]) {
    super("Cart items unavailable");
    this.unavailable = unavailable;
    this.name = "CartUnavailableError";
  }
}

// ─────────────────────────────────────────────
// Shared: release stale PENDING orders holding stock on given variants
// ─────────────────────────────────────────────
// Must be called inside the same transaction as the stock check that follows
// it, so a stale order can't be released and then immediately re-reserved by
// a concurrent request before this transaction commits.

async function releaseStaleReservations(
  tx: Prisma.TransactionClient,
  variantIds: string[]
) {
  const cutoff = new Date(Date.now() - RESERVATION_WINDOW_MINUTES * 60 * 1000);

  const staleOrders = await tx.order.findMany({
    where: {
      status: "PENDING",
      createdAt: { lt: cutoff },
      items: { some: { variantId: { in: variantIds } } },
    },
    include: { items: true },
  });

  for (const order of staleOrders) {
    for (const item of order.items) {
      await tx.variant.update({
        where: { id: item.variantId },
        data: { stockQuantity: { increment: item.quantity } },
      });
    }
    await tx.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED" },
    });
  }
}

// ─────────────────────────────────────────────
// checkCartAvailability
// ─────────────────────────────────────────────
// Read-only check the cart/checkout page can call to show a "price changed"
// or "only 2 left" banner BEFORE the guest submits the order. Also releases
// stale reservations as a side effect, so stock shown here is real.

export async function checkCartAvailability(
  items: CheckoutItemInput[]
): Promise<CartAvailabilityResult> {
  const variantIds = items.map((i) => i.variantId);

  const results = await prisma.$transaction(async (tx) => {
    await releaseStaleReservations(tx, variantIds);

    const variants = await tx.variant.findMany({
      where: { id: { in: variantIds } },
      include: { bike: { select: { basePrice: true } } },
    });

    return items.map((requested): CartAvailabilityItem => {
      const variant = variants.find((v) => v.id === requested.variantId);

      if (!variant) {
        return {
          variantId: requested.variantId,
          requestedQuantity: requested.quantity,
          availableStock: 0,
          currentUnitPrice: 0,
          inStock: false,
        };
      }

      const currentUnitPrice = new Prisma.Decimal(variant.bike.basePrice)
        .plus(variant.priceAdjustment)
        .toNumber();

      return {
        variantId: variant.id,
        requestedQuantity: requested.quantity,
        availableStock: variant.stockQuantity,
        currentUnitPrice,
        inStock: variant.stockQuantity >= requested.quantity,
      };
    });
  });

  return {
    items: results,
    allAvailable: results.every((r) => r.inStock),
  };
}

// ─────────────────────────────────────────────
// createGuestOrder
// ─────────────────────────────────────────────

function generateTrackingToken(): string {
  // e.g. "RC-4F9A2B1C" — short enough to type into the /track lookup page,
  // long enough to not be guessable.
  return `RC-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function createGuestOrder(
  input: GuestCheckoutInput
): Promise<CreateOrderResult> {
  if (input.items.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  if (input.fulfillmentType === "SHIP" && !input.guestAddressLine?.trim()) {
    return {
      success: false,
      error: "A delivery address is required for shipping.",
    };
  }

  if (!input.guestName.trim() || !input.guestEmail.trim() || !input.guestPhone.trim()) {
    return { success: false, error: "Name, email, and phone are required." };
  }

  const variantIds = input.items.map((i) => i.variantId);

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Release anyone else's abandoned holds on these variants first, so
      // this check sees real availability.
      await releaseStaleReservations(tx, variantIds);

      const variants = await tx.variant.findMany({
        where: { id: { in: variantIds } },
        include: { bike: { select: { name: true, basePrice: true } } },
      });

      // Server-truth check: never trust stock or price from the client cart.
      const unavailable: CartAvailabilityItem[] = [];
      for (const requested of input.items) {
        const variant = variants.find((v) => v.id === requested.variantId);
        if (!variant || variant.stockQuantity < requested.quantity) {
          unavailable.push({
            variantId: requested.variantId,
            requestedQuantity: requested.quantity,
            availableStock: variant?.stockQuantity ?? 0,
            currentUnitPrice: variant
              ? new Prisma.Decimal(variant.bike.basePrice)
                  .plus(variant.priceAdjustment)
                  .toNumber()
              : 0,
            inStock: false,
          });
        }
      }

      if (unavailable.length > 0) {
        // Thrown as a proper Error subclass so the catch block below can
        // narrow it safely with `instanceof` — no unsafe cast needed.
        throw new CartUnavailableError(unavailable);
      }

      // Compute total and snapshot per-item prices from current DB values.
      let total = new Prisma.Decimal(0);
      const orderItemsData = input.items.map((requested) => {
        const variant = variants.find((v) => v.id === requested.variantId)!;
        const unitPrice = new Prisma.Decimal(variant.bike.basePrice).plus(
          variant.priceAdjustment
        );
        total = total.plus(unitPrice.times(requested.quantity));

        return {
          variantId: requested.variantId,
          quantity: requested.quantity,
          priceAtPurchase: unitPrice,
        };
      });

      // Reserve stock now — this is the hold. Released by
      // releaseStaleReservations() if this order isn't paid within
      // RESERVATION_WINDOW_MINUTES.
      for (const item of orderItemsData) {
        await tx.variant.update({
          where: { id: item.variantId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      const trackingToken = generateTrackingToken();

      const createdOrder = await tx.order.create({
        data: {
          status: "PENDING",
          fulfillmentType: input.fulfillmentType,
          guestName: input.guestName.trim(),
          guestEmail: input.guestEmail.trim(),
          guestPhone: input.guestPhone.trim(),
          guestAddressLine:
            input.fulfillmentType === "SHIP"
              ? input.guestAddressLine!.trim()
              : null,
          total,
          trackingToken,
          items: { create: orderItemsData },
        },
      });

      return createdOrder;
    });

    return {
      success: true,
      orderId: order.id,
      trackingToken: order.trackingToken!,
    };
  } catch (err) {
    if (err instanceof CartUnavailableError) {
      return {
        success: false,
        error:
          "Some items in your cart are no longer available in the quantity requested.",
        unavailable: err.unavailable,
      };
    }

    console.error("createGuestOrder failed:", err);
    return {
      success: false,
      error: "Something went wrong creating your order. Please try again.",
    };
  }
}