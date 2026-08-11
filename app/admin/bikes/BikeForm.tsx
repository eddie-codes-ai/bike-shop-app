"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Variant = {
  id?: string;
  size: string;
  color: string;
  sku: string;
  priceAdjustment: number;
  stockQuantity: number;
};

export type BikeFormValues = {
  name: string;
  brand: string;
  category: string;
  condition: string;
  basePrice: number;
  description: string;
  active: boolean;
  specs: Record<string, string | number>;
  variants: Variant[];
};

type InitialValues = Partial<Omit<BikeFormValues, "specs">> & {
  specs?: Record<string, string | number | undefined>;
};

const CATEGORIES = ["ROAD", "MOUNTAIN", "HYBRID", "E_BIKE", "KIDS"];
const CONDITIONS = ["NEW", "USED"];
const SPEC_FIELDS = [
  ["frameMaterial", "Frame material"],
  ["gears", "Gears"],
  ["brakeType", "Brake type"],
  ["wheelSize", "Wheel size"],
  ["suspension", "Suspension"],
  ["weightKg", "Weight (kg)"],
] as const;

const emptyVariant: Variant = {
  size: "",
  color: "",
  sku: "",
  priceAdjustment: 0,
  stockQuantity: 0,
};

export function BikeForm({
  initialValues,
  onSubmit,
  submitLabel,
}: {
  initialValues?: InitialValues;
  onSubmit: (values: BikeFormValues) => Promise<void>;
  submitLabel: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialValues?.name ?? "");
  const [brand, setBrand] = useState(initialValues?.brand ?? "Ridgeback");
  const [category, setCategory] = useState(initialValues?.category ?? "ROAD");
  const [condition, setCondition] = useState(initialValues?.condition ?? "NEW");
  const [basePrice, setBasePrice] = useState(initialValues?.basePrice ?? 0);
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [active, setActive] = useState(initialValues?.active ?? true);
  const [specs, setSpecs] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const [key] of SPEC_FIELDS) {
      initial[key] = String(initialValues?.specs?.[key] ?? "");
    }
    return initial;
  });
  const [variants, setVariants] = useState<Variant[]>(
    initialValues?.variants?.length ? initialValues.variants : [{ ...emptyVariant }]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateVariant(index: number, field: keyof Variant, value: string | number) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  }

  function addVariant() {
    setVariants((prev) => [...prev, { ...emptyVariant }]);
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (variants.length === 0) {
      setError("Add at least one variant (size/color combo) before saving.");
      return;
    }

    setSaving(true);
    try {
      const cleanSpecs: Record<string, string | number> = {};
      for (const [key] of SPEC_FIELDS) {
        const value = specs[key];
        if (!value) continue;
        cleanSpecs[key] = key === "weightKg" ? Number(value) : value;
      }

      await onSubmit({
        name,
        brand,
        category,
        condition,
        basePrice,
        description,
        active,
        specs: cleanSpecs,
        variants,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong saving this bike."
      );
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-wide text-graphite mb-1">NAME</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-line rounded px-3 py-2 text-sm bg-paper"
          />
        </div>
        <div>
          <label className="block text-xs tracking-wide text-graphite mb-1">BRAND</label>
          <input
            required
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full border border-line rounded px-3 py-2 text-sm bg-paper"
          />
        </div>
        <div>
          <label className="block text-xs tracking-wide text-graphite mb-1">CATEGORY</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-line rounded px-3 py-2 text-sm bg-paper"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs tracking-wide text-graphite mb-1">CONDITION</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full border border-line rounded px-3 py-2 text-sm bg-paper"
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs tracking-wide text-graphite mb-1">
            BASE PRICE (KES)
          </label>
          <input
            required
            type="number"
            min={0}
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
            className="w-full border border-line rounded px-3 py-2 text-sm bg-paper"
          />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            id="active"
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          <label htmlFor="active" className="text-xs tracking-wide text-graphite">
            VISIBLE ON STOREFRONT
          </label>
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-wide text-graphite mb-1">
          DESCRIPTION
        </label>
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-line rounded px-3 py-2 text-sm bg-paper"
        />
      </div>

      <div>
        <p className="text-xs tracking-wide text-graphite mb-2">SPECS (optional)</p>
        <div className="grid grid-cols-3 gap-4">
          {SPEC_FIELDS.map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs text-graphite mb-1">{label}</label>
              <input
                value={specs[key]}
                onChange={(e) =>
                  setSpecs((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className="w-full border border-line rounded px-2 py-1.5 text-sm bg-paper"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs tracking-wide text-graphite">VARIANTS</p>
          <button
            type="button"
            onClick={addVariant}
            className="text-xs text-murram hover:underline"
          >
            + ADD VARIANT
          </button>
        </div>
        <div className="space-y-2">
          {variants.map((variant, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-2 items-center border border-line rounded p-2"
            >
              <input
                placeholder="Size"
                value={variant.size}
                onChange={(e) => updateVariant(i, "size", e.target.value)}
                className="border border-line rounded px-2 py-1.5 text-sm bg-paper"
              />
              <input
                placeholder="Color"
                value={variant.color}
                onChange={(e) => updateVariant(i, "color", e.target.value)}
                className="border border-line rounded px-2 py-1.5 text-sm bg-paper"
              />
              <input
                placeholder="SKU"
                value={variant.sku}
                onChange={(e) => updateVariant(i, "sku", e.target.value)}
                className="border border-line rounded px-2 py-1.5 text-sm bg-paper"
              />
              <input
                placeholder="Price +/-"
                type="number"
                value={variant.priceAdjustment}
                onChange={(e) =>
                  updateVariant(i, "priceAdjustment", Number(e.target.value))
                }
                className="border border-line rounded px-2 py-1.5 text-sm bg-paper"
              />
              <input
                placeholder="Stock"
                type="number"
                min={0}
                value={variant.stockQuantity}
                onChange={(e) =>
                  updateVariant(i, "stockQuantity", Number(e.target.value))
                }
                className="border border-line rounded px-2 py-1.5 text-sm bg-paper"
              />
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="text-xs text-graphite hover:text-murram"
              >
                REMOVE
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-murram" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-frame text-paper text-sm font-semibold tracking-wide px-6 py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "SAVING..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/bikes")}
          className="text-sm text-graphite hover:text-frame"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}