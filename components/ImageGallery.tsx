'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { BikeImage } from '@/lib/types';

export function ImageGallery({ images, alt }: { images: BikeImage[]; alt: string }) {
  const sorted = [...images].sort((a, b) => a.position - b.position);
  const [activeId, setActiveId] = useState(sorted[0]?.id);
  const active = sorted.find((img) => img.id === activeId) ?? sorted[0];

  if (sorted.length === 0) {
    return (
      <div className="aspect-[4/3] bg-line flex items-center justify-center font-mono text-xs text-graphite">
        No image yet
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/3] bg-line overflow-hidden border border-line">
        <Image
          src={active.url}
          alt={active.altText ?? alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
      {sorted.length > 1 && (
        <div className="flex gap-2 mt-3" role="tablist" aria-label="Bike images">
          {sorted.map((img) => (
            <button
              key={img.id}
              type="button"
              role="tab"
              aria-selected={img.id === active.id}
              onClick={() => setActiveId(img.id)}
              className={`relative w-16 h-16 border overflow-hidden shrink-0 transition-colors ${
                img.id === active.id ? 'border-frame' : 'border-line hover:border-graphite'
              }`}
            >
              <Image src={img.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}