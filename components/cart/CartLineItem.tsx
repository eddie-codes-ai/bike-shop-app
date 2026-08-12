"use client";

import Image from "next/image";
import { CartItem, useCart } from "@/lib/cart/CartContext";
import { formatKES } from "@/lib/format";

export function CartLineItem({ item }: { item: CartItem }) {
  const { setQuantity, removeItem } = useCart();

  const lineTotal = item.unitPrice * item.quantity;
  const atMaxStock = item.quantity >= item.stockQuantity;

  return (
    <div className="flex gap-4 py-4 border-b border-border">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.bikeName}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <p className="font-medium">{item.bikeName}</p>
          <p className="text-sm text-muted-foreground">
            {item.size} · {item.color}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity(item.variantId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="h-7 w-7 rounded border border-border disabled:opacity-40"
              aria-label={`Decrease quantity of ${item.bikeName}`}
            >
              −
            </button>
            <span className="w-6 text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(item.variantId, item.quantity + 1)}
              disabled={atMaxStock}
              className="h-7 w-7 rounded border border-border disabled:opacity-40"
              aria-label={`Increase quantity of ${item.bikeName}`}
            >
              +
            </button>
            {atMaxStock ? (
              <span className="text-xs text-muted-foreground">
                Max in stock
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.variantId)}
            className="text-sm text-muted-foreground underline-offset-2 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="shrink-0 text-right font-medium">
        {formatKES(lineTotal)}
      </div>
    </div>
  );
}