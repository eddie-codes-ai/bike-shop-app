// Mirrors the enums/models in prisma/schema.prisma.
// Kept in sync by hand for now since Stage 2 runs on mock data — once
// Stage 3 connects the real database, these can be swapped for Prisma's
// generated types (`import type { Bike, Variant } from '@prisma/client'`).

export type Category = 'ROAD' | 'MOUNTAIN' | 'HYBRID' | 'E_BIKE' | 'KIDS';
export type Condition = 'NEW' | 'USED';

export const CATEGORY_LABELS: Record<Category, string> = {
  ROAD: 'Road',
  MOUNTAIN: 'Mountain',
  HYBRID: 'Hybrid',
  E_BIKE: 'E-Bike',
  KIDS: 'Kids',
};

export interface VariantSummary {
  id: string;
  size: string;
  color: string;
  sku: string;
  priceAdjustment: number;
  stockQuantity: number;
}

export interface BikeImage {
  id: string;
  url: string;
  altText: string | null;
  position: number;
}

export interface BikeSpecs {
  frameMaterial?: string;
  gears?: string;
  brakeType?: string;
  wheelSize?: string;
  suspension?: string;
  weightKg?: number;
  [key: string]: string | number | undefined;
}

export interface BikeSummary {
  id: string;
  name: string;
  brand: string;
  category: Category;
  condition: Condition;
  basePrice: number;
  active: boolean;
  images: BikeImage[];
  variants: VariantSummary[];
}

export interface BikeDetail extends BikeSummary {
  description: string;
  specs: BikeSpecs | null;
}

export interface CatalogFilters {
  category?: Category;
  condition?: Condition;
  q?: string;
  sort?: 'price-asc' | 'price-desc' | 'newest';
}