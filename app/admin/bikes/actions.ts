"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Category, Condition } from "@prisma/client";

type VariantInput = {
  size: string;
  color: string;
  sku: string;
  priceAdjustment: number;
  stockQuantity: number;
};

type BikeInput = {
  name: string;
  brand: string;
  category: Category;
  condition: Condition;
  basePrice: number;
  description: string;
  active: boolean;
  specs: Record<string, string | number>;
  variants: VariantInput[];
};

async function requireStaffSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/login");
  return session;
}

export async function createBike(input: BikeInput) {
  await requireStaffSession();

  const bike = await prisma.bike.create({
    data: {
      name: input.name,
      brand: input.brand,
      category: input.category,
      condition: input.condition,
      basePrice: input.basePrice,
      description: input.description,
      active: input.active,
      specs: input.specs,
      variants: { create: input.variants },
    },
  });

  revalidatePath("/admin/bikes");
  revalidatePath("/");
  redirect(`/admin/bikes/${bike.id}`);
}

export async function updateBike(bikeId: string, input: BikeInput) {
  await requireStaffSession();

  // Variants are fully replaced on every edit (delete existing, recreate
  // from the submitted list) rather than diffed field-by-field. That's a
  // deliberate simplification while there's no order history yet -- the
  // schema has no onDelete: Cascade from Variant to OrderItem on purpose,
  // to protect order records, so once real orders exist this delete+
  // recreate approach will start failing on any variant that's been
  // ordered. At that point this needs to become a real diff: update
  // variants that still exist, only create/delete what actually changed.
  await prisma.$transaction([
    prisma.variant.deleteMany({ where: { bikeId } }),
    prisma.bike.update({
      where: { id: bikeId },
      data: {
        name: input.name,
        brand: input.brand,
        category: input.category,
        condition: input.condition,
        basePrice: input.basePrice,
        description: input.description,
        active: input.active,
        specs: input.specs,
        variants: { create: input.variants },
      },
    }),
  ]);

  revalidatePath("/admin/bikes");
  revalidatePath(`/bikes/${bikeId}`);
  revalidatePath("/");
}

export async function deleteBike(bikeId: string) {
  await requireStaffSession();

  // Will throw (and the transaction/delete will fail) if any variant on
  // this bike has OrderItems referencing it -- that's intentional, it
  // stops order history from being silently destroyed. The edit page's
  // UI nudges toward hiding (active: false) instead of deleting for
  // exactly this reason.
  await prisma.bike.delete({ where: { id: bikeId } });

  revalidatePath("/admin/bikes");
  revalidatePath("/");
  redirect("/admin/bikes");
}