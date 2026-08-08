'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { CATEGORY_LABELS, type Category } from '@/lib/types';

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

export function CatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get('category');
  const activeCondition = searchParams.get('condition');
  const activeSort = searchParams.get('sort') ?? '';

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <FilterChip active={!activeCategory} onClick={() => updateParam('category', null)}>
          All
        </FilterChip>
        {CATEGORIES.map((cat) => (
          <FilterChip
            key={cat}
            active={activeCategory === cat}
            onClick={() => updateParam('category', cat)}
          >
            {CATEGORY_LABELS[cat]}
          </FilterChip>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by condition">
          <FilterChip active={!activeCondition} onClick={() => updateParam('condition', null)} small>
            Any condition
          </FilterChip>
          <FilterChip
            active={activeCondition === 'NEW'}
            onClick={() => updateParam('condition', 'NEW')}
            small
          >
            New
          </FilterChip>
          <FilterChip
            active={activeCondition === 'USED'}
            onClick={() => updateParam('condition', 'USED')}
            small
          >
            Used
          </FilterChip>
        </div>

        <label className="font-mono text-[11px] uppercase tracking-widest text-graphite flex items-center gap-2">
          Sort
          <select
            value={activeSort}
            onChange={(e) => updateParam('sort', e.target.value || null)}
            className="border border-line bg-paper px-2 py-1 font-mono text-xs text-frame focus-visible:outline-murram"
          >
            <option value="">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
  small = false,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border border-line font-mono uppercase tracking-widest transition-colors hover:border-frame ${
        small ? 'text-[10px] px-2.5 py-1' : 'text-xs px-3 py-1.5'
      } ${active ? 'bg-frame text-paper' : ''}`}
    >
      {children}
    </button>
  );
}