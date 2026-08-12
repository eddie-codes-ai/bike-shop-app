"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";

// Drop this anywhere in SiteHeader's nav/icon row, e.g.:
//   <CartLink />
export function CartLink() {
  const { itemCount, isHydrated } = useCart();

  return (
    <Link href="/cart" className="relative inline-flex items-center" aria-label="Cart">
      <span>Cart</span>
      {isHydrated && itemCount > 0 ? (
        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
          {itemCount}
        </span>
      ) : null}
    </Link>
  );
}