import Link from 'next/link';

export default function BikeNotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-graphite">404</p>
      <h1 className="font-display font-extrabold text-4xl text-frame mt-2">
        We don&apos;t have that bike listed
      </h1>
      <p className="font-body text-graphite mt-3">
        It may have sold out and been removed, or the link is off.
      </p>
      <Link
        href="/"
        className="inline-block mt-6 font-mono text-xs uppercase tracking-widest text-murram hover:underline"
      >
        ← Back to catalog
      </Link>
    </div>
  );
}