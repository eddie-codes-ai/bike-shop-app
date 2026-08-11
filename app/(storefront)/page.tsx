import { Suspense } from 'react';
import { getBikes } from '@/lib/data/bikes';
import { BikeGrid } from '@/components/BikeGrid';
import { CatalogFilters } from '@/components/CatalogFilters';
import type { Category, Condition } from '@/lib/types';

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; condition?: string; sort?: string }>;
}) {
  const params = await searchParams;

  const bikes = await getBikes({
    category: params.category as Category | undefined,
    condition: params.condition as Condition | undefined,
    sort: params.sort as 'price-asc' | 'price-desc' | 'newest' | undefined,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <section>
        <p className="font-mono text-xs uppercase tracking-widest text-murram">
          One location · Ship or collect
        </p>
        <h1 className="font-display font-extrabold text-5xl sm:text-6xl leading-[0.95] text-frame mt-2 max-w-2xl">
          Bikes set up for the roads and trails around here.
        </h1>
        <p className="font-body text-graphite mt-4 max-w-xl">
          New and shop-serviced used bikes, sized and checked before they leave. Buy as a guest —
          no account needed — and choose delivery or pickup at checkout.
        </p>
      </section>

      <section className="mt-8">
        <Suspense fallback={null}>
          <CatalogFilters />
        </Suspense>
      </section>

      <section className="mt-8">
        <BikeGrid bikes={bikes} />
      </section>
    </div>
  );
}