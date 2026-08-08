import type { BikeSummary } from '@/lib/types';
import { BikeCard } from './BikeCard';

export function BikeGrid({ bikes }: { bikes: BikeSummary[] }) {
  if (bikes.length === 0) {
    return (
      <div className="border border-dashed border-line py-16 text-center">
        <p className="font-display font-bold text-2xl text-frame">Nothing matches those filters</p>
        <p className="font-mono text-xs text-graphite mt-2 uppercase tracking-widest">
          Try clearing a filter or widening the search
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {bikes.map((bike) => (
        <BikeCard key={bike.id} bike={bike} />
      ))}
    </div>
  );
}