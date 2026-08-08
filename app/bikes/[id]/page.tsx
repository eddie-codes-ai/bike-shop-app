import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllBikeIds, getBikeById } from '@/lib/data/bikes';
import { CATEGORY_LABELS } from '@/lib/types';
import { ImageGallery } from '@/components/ImageGallery';
import { VariantPicker } from '@/components/VariantPicker';
import { SpecSheet } from '@/components/SpecSheet';
import { GoogleReviewsSection } from '@/components/GoogleReviewsSection';

// Pre-renders one static page per bike at build time, using every ID
// currently in the mock data. Once Stage 3 connects the real database,
// this same function will just call the Prisma equivalent of getAllBikeIds().
export async function generateStaticParams() {
  const ids = await getAllBikeIds();
  return ids.map((id) => ({ id }));
}

export default async function BikeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bike = await getBikeById(id);
  if (!bike) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-widest text-graphite hover:text-frame"
      >
        ← Back to catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-6">
        <ImageGallery images={bike.images} alt={bike.name} />

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-graphite">
            {CATEGORY_LABELS[bike.category]} · {bike.brand} ·{' '}
            {bike.condition === 'USED' ? 'Used' : 'New'}
          </p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl leading-[0.95] text-frame mt-2">
            {bike.name}
          </h1>
          <p className="font-body text-graphite mt-4 max-w-md">{bike.description}</p>

          <div className="mt-6">
            <VariantPicker basePrice={bike.basePrice} variants={bike.variants} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">
        <SpecSheet specs={bike.specs} />
        <div className="font-mono text-xs text-graphite uppercase tracking-widest leading-relaxed">
          <p>Ship or collect in-store</p>
          <p className="mt-1">Serviced and checked before it leaves the shop</p>
          <p className="mt-1">No account needed to buy — checkout as a guest</p>
        </div>
      </div>

      <div className="mt-12">
        <GoogleReviewsSection />
      </div>
    </div>
  );
}