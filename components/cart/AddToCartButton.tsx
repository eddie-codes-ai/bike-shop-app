"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/CartContext";

interface AddToCartButtonProps {
  variantId: string;
  bikeId: string;
  bikeName: string;
  image: string | null;
  size: string;
  color: string;
  unitPrice: number; // basePrice + priceAdjustment — display-only, server re-checks at checkout
  stockQuantity: number;
}

// Drop this into VariantPicker once a variant is selected, e.g.:
//   <AddToCartButton
//     variantId={selectedVariant.id}
//     bikeId={bike.id}
//     bikeName={bike.name}
//     image={bike.images[0]?.url ?? null}
//     size={selectedVariant.size}
//     color={selectedVariant.color}
//     unitPrice={Number(bike.basePrice) + Number(selectedVariant.priceAdjustment)}
//     stockQuantity={selectedVariant.stockQuantity}
//   />
export function AddToCartButton(props: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const outOfStock = props.stockQuantity <= 0;

  function handleClick() {
    if (outOfStock) return;

    addItem({
      variantId: props.variantId,
      bikeId: props.bikeId,
      bikeName: props.bikeName,
      image: props.image,
      size: props.size,
      color: props.color,
      unitPrice: props.unitPrice,
      quantity: 1,
      stockQuantity: props.stockQuantity,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={outOfStock}
      className="w-full rounded-md bg-primary py-3 font-medium text-primary-foreground disabled:opacity-40"
    >
      {outOfStock ? "Out of stock" : justAdded ? "Added ✓" : "Add to cart"}
    </button>
  );
}