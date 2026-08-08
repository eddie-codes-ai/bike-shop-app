import Image from 'next/image';
import Link from 'next/link';
import type { BikeSummary } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';
import { formatKES } from '@/lib/format';

export function BikeCard({ bike }: { bike: BikeSummary }) {
  const cover = bike.images[0];
  const inStock = bike.variants.some((v) => v.stockQuantity > 0);
  const lowestPrice =
    bike.basePrice + Math.min(0, ...bike.variants.map((v) => v.priceAdjustment));

  return (
    <Link
      href={`/bikes/${bike.id}`}
      className="group block bg-panel border border-line hover:border-frame transition-colors"
    >
      <div className="relative aspect-[4/3] bg-line overflow-hidden">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.altText ?? bike.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-graphite">
            No image yet
          </div>
        )}
        <span className="absolute top-2 left-2 bg-paper/90 border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-frame">
          {bike.condition === 'USED' ? 'Used' : 'New'}
        </span>
        {!inStock && (
          <span className="absolute top-2 right-2 bg-frame/90 text-paper px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest">
            Out of stock
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-graphite">
          {CATEGORY_LABELS[bike.category]} · {bike.brand}
        </p>
        <h3 className="font-display font-bold text-xl leading-tight text-frame mt-1">
          {bike.name}
        </h3>
        <p className="font-mono text-sm text-frame mt-2">{formatKES(lowestPrice)}</p>
      </div>
    </Link>
  );
}