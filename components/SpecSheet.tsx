import type { BikeSpecs } from '@/lib/types';

const LABELS: Record<string, string> = {
  frameMaterial: 'Frame',
  gears: 'Gears',
  brakeType: 'Brakes',
  wheelSize: 'Wheel size',
  suspension: 'Suspension',
  weightKg: 'Weight',
};

export function SpecSheet({ specs }: { specs: BikeSpecs | null }) {
  if (!specs || Object.keys(specs).length === 0) return null;

  const entries = Object.entries(specs).filter(([, v]) => v !== undefined && v !== '');

  return (
    <div className="border border-line">
      <p className="font-mono text-[11px] uppercase tracking-widest text-graphite px-4 pt-3 pb-2">
        Spec sheet
      </p>
      <dl>
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between px-4 py-2.5 border-t border-line first:border-t-0"
          >
            <dt className="font-body text-sm text-graphite">{LABELS[key] ?? key}</dt>
            <dd className="font-mono text-sm text-frame">
              {key === 'weightKg' ? `${value} kg` : String(value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}