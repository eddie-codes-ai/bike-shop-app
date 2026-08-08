import { getGoogleReviews } from '@/lib/data/google-reviews';

export async function GoogleReviewsSection() {
  const data = await getGoogleReviews();

  if (!data) {
    return (
      <div className="border border-dashed border-line p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-graphite">
          Google reviews not connected yet
        </p>
        <p className="font-body text-sm text-graphite mt-2 max-w-md">
          Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in .env.local to pull in ratings from the
          shop&apos;s Google Business Profile.
        </p>
      </div>
    );
  }

  if (data.reviews.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="reviews-heading">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <h2 id="reviews-heading" className="font-display font-bold text-2xl text-frame">
          From Google Reviews
        </h2>
        <div className="flex items-center gap-2 font-mono text-sm text-frame">
          <StarRating rating={data.overallRating} />
          <span>{data.overallRating.toFixed(1)}</span>
          <span className="text-graphite">· {data.totalReviewCount} reviews</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {data.reviews.map((review, i) => (
          <div key={i} className="border border-line p-4">
            <div className="flex items-center justify-between">
              <StarRating rating={review.rating} />
              <span className="font-mono text-[10px] text-graphite uppercase tracking-widest">
                {review.relativeTimeDescription}
              </span>
            </div>
            <p className="font-body text-sm text-frame mt-3 line-clamp-5">{review.text}</p>
            <p className="font-mono text-[11px] text-graphite mt-3 uppercase tracking-widest">
              {review.authorName}
            </p>
          </div>
        ))}
      </div>

      <a
        href={data.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-5 font-mono text-xs uppercase tracking-widest text-murram hover:underline"
      >
        See all reviews on Google →
      </a>
    </section>
  );
}

function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <span aria-label={`${rating.toFixed(1)} out of 5 stars`} className="text-murram">
      {'★'.repeat(rounded)}
      <span className="text-line">{'★'.repeat(5 - rounded)}</span>
    </span>
  );
}