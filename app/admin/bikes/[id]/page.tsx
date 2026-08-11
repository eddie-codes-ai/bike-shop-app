import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EditBikeForm } from "./EditBikeForm";

export default async function EditBikePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const bike = await prisma.bike.findUnique({
    where: { id },
    include: { variants: true },
  });

  if (!bike) notFound();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line px-6 py-4">
        <Link
          href="/admin/bikes"
          className="text-xs text-graphite hover:text-murram"
        >
          &larr; BACK TO BIKES
        </Link>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-xl font-bold text-frame mb-6">Edit {bike.name}</h1>
        <EditBikeForm
          bikeId={bike.id}
          initialValues={{
            name: bike.name,
            brand: bike.brand,
            category: bike.category,
            condition: bike.condition,
            basePrice: Number(bike.basePrice),
            description: bike.description,
            active: bike.active,
            specs: (bike.specs as Record<string, string | number>) ?? {},
            variants: bike.variants.map((v) => ({
              id: v.id,
              size: v.size,
              color: v.color,
              sku: v.sku,
              priceAdjustment: Number(v.priceAdjustment),
              stockQuantity: v.stockQuantity,
            })),
          }}
        />
      </main>
    </div>
  );
}