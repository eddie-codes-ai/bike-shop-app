"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import { formatKES } from "@/lib/format";
import { CartLineItem } from "@/components/cart/CartLineItem";

export default function CartPage() {
  const { items, subtotal, isHydrated } = useCart();

  // Avoid flashing an "empty cart" message before localStorage has been
  // read on mount — see CartContext's isHydrated flag.
  if (!isHydrated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Browse the catalog to find your next bike.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-primary px-6 py-2 text-primary-foreground"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Your cart</h1>

      <div className="mt-6">
        {items.map((item) => (
          <CartLineItem key={item.variantId} item={item} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <span className="text-lg font-medium">Subtotal</span>
        <span className="text-lg font-semibold">{formatKES(subtotal)}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Shipping cost or pickup details are confirmed at checkout.
      </p>

      <Link
        href="/checkout"
        className="mt-6 block w-full rounded-md bg-primary py-3 text-center font-medium text-primary-foreground"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}