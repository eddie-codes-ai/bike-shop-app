import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { BikeDetail, BikeSummary, CatalogFilters } from "@/lib/types";

// ─────────────────────────────────────────────────────────────
// STAGE 3: this file now queries the real database via Prisma instead of
// the Stage 2 mock array. getBikes / getBikeById / getAllBikeIds all keep
// the exact same name, signature, and return shape as before, so nothing
// that calls them (BikeGrid, the detail page, generateStaticParams, etc.)
// needed to change.
// ─────────────────────────────────────────────────────────────

type BikeWithRelations = Prisma.BikeGetPayload<{
  include: { images: true; variants: true };
}>;

function toBikeSummary(bike: BikeWithRelations): BikeSummary {
  return {
    id: bike.id,
    name: bike.name,
    brand: bike.brand,
    category: bike.category as BikeSummary["category"],
    condition: bike.condition as BikeSummary["condition"],
    basePrice: Number(bike.basePrice),
    active: bike.active,
    images: bike.images
      .sort((a, b) => a.position - b.position)
      .map((img) => ({
        id: img.id,
        url: img.url,
        altText: img.altText,
        position: img.position,
      })),
    variants: bike.variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      sku: v.sku,
      priceAdjustment: Number(v.priceAdjustment),
      stockQuantity: v.stockQuantity,
    })),
  };
}

export async function getBikes(
  filters: CatalogFilters = {}
): Promise<BikeSummary[]> {
  const where: Prisma.BikeWhereInput = { active: true };

  if (filters.category) where.category = filters.category;
  if (filters.condition) where.condition = filters.condition;
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { brand: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  let orderBy: Prisma.BikeOrderByWithRelationInput = { createdAt: "desc" };
  if (filters.sort === "price-asc") orderBy = { basePrice: "asc" };
  if (filters.sort === "price-desc") orderBy = { basePrice: "desc" };

  const bikes = await prisma.bike.findMany({
    where,
    orderBy,
    include: { images: true, variants: true },
  });

  return bikes.map(toBikeSummary);
}

export async function getBikeById(id: string): Promise<BikeDetail | null> {
  const bike = await prisma.bike.findFirst({
    where: { id, active: true },
    include: { images: true, variants: true },
  });

  if (!bike) return null;

  return {
    ...toBikeSummary(bike),
    description: bike.description,
    specs: bike.specs as BikeDetail["specs"],
  };
}

export async function getAllBikeIds(): Promise<string[]> {
  const bikes = await prisma.bike.findMany({
    where: { active: true },
    select: { id: true },
  });
  return bikes.map((b) => b.id);
}