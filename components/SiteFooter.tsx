export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
        <div>
          <p className="font-display font-bold text-lg uppercase text-frame">Ridgeback Cycles</p>
          <p className="font-mono text-xs text-graphite mt-1">
            One location · Ships countrywide · Pickup in-store
          </p>
        </div>
        <p className="font-mono text-[11px] text-graphite uppercase tracking-widest">
          No account needed to buy
        </p>
      </div>
    </footer>
  );
}