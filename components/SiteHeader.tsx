import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display font-extrabold text-2xl tracking-tight uppercase text-frame">
            Ridgeback
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-graphite">
            Cycles
          </span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-graphite">
          <Link href="/" className="hover:text-frame transition-colors">
            Catalog
          </Link>
          <a href="#" className="hover:text-frame transition-colors">
            Pickup &amp; delivery
          </a>
          <a href="#" className="hover:text-frame transition-colors">
            Find us
          </a>
        </nav>
      </div>
    </header>
  );
}