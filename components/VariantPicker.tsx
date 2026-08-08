'use client';

import { useMemo, useState } from 'react';
import type { VariantSummary } from '@/lib/types';
import { formatKES } from '@/lib/format';

export function VariantPicker({
  basePrice,
  variants,
}: {
  basePrice: number;
  variants: VariantSummary[];
}) {
  // Hooks must run unconditionally (Rules of Hooks) even when `variants` is
  // empty, so the "no variants" case is handled in the return below instead
  // of an early return up here.
  //
  // Both useState calls below are explicitly typed <string | undefined>.
  // Without that, TypeScript infers the type purely from the initial value —
  // and plain array indexing (sizes[0]) is treated as always-defined by
  // default, while .find() calls later on are honestly typed as possibly
  // undefined. Being explicit here avoids that mismatch.
  const sizes = useMemo(() => Array.from(new Set(variants.map((v) => v.size))), [variants]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(sizes[0]);

  const colorsForSize = useMemo(
    () => variants.filter((v) => v.size === selectedSize),
    [variants, selectedSize]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(colorsForSize[0]?.color);

  if (variants.length === 0) {
    return (
      <div className="border border-line p-5">
        <p className="font-mono text-sm text-graphite">
          No sizes or colors are configured for this bike yet.
        </p>
      </div>
    );
  }

  const selected =
    variants.find((v) => v.size === selectedSize && v.color === selectedColor) ?? variants[0];

  function handleSizeChange(size: string) {
    setSelectedSize(size);
    const firstColorForSize = variants.find((v) => v.size === size);
    setSelectedColor(firstColorForSize?.color);
  }

  const price = basePrice + selected.priceAdjustment;
  const inStock = selected.stockQuantity > 0;

  return (
    <div className="border border-line p-5">
      <p className="font-mono text-2xl text-frame">{formatKES(price)}</p>

      <div className="mt-5">
        <p className="font-mono text-[11px] uppercase tracking-widest text-graphite mb-2">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => handleSizeChange(size)}
              aria-pressed={size === selectedSize}
              className={`border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors hover:border-frame ${
                size === selectedSize ? 'bg-frame text-paper' : ''
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-graphite mb-2">Color</p>
        <div className="flex flex-wrap gap-2">
          {colorsForSize.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelectedColor(v.color)}
              aria-pressed={v.color === selectedColor}
              disabled={v.stockQuantity === 0}
              className={`border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors hover:border-frame disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-line ${
                v.color === selectedColor ? 'bg-frame text-paper' : ''
              }`}
            >
              {v.color}
              {v.stockQuantity === 0 ? ' · Out' : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
        <span
          className={`inline-block w-2 h-2 rounded-full ${inStock ? 'bg-highland' : 'bg-graphite'}`}
          aria-hidden="true"
        />
        <span className={inStock ? 'text-highland' : 'text-graphite'}>
          {inStock ? `${selected.stockQuantity} in stock` : 'Out of stock in this size/color'}
        </span>
      </div>

      <button
        type="button"
        disabled
        title="Cart and checkout arrive in a later build stage"
        className="mt-5 w-full bg-frame text-paper font-mono text-xs uppercase tracking-widest py-3 opacity-50 cursor-not-allowed"
      >
        Add to cart — coming soon
      </button>
      <p className="font-mono text-[10px] text-graphite mt-2 text-center uppercase tracking-widest">
        SKU {selected.sku}
      </p>
    </div>
  );
}