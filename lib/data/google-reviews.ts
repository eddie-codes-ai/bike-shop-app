// Fetches the shop's Google Business Profile rating + reviews via the
// Google Places API (Place Details), so we don't need a paid review-widget
// service. Requires two env vars in .env.local:
//   GOOGLE_PLACES_API_KEY  — API key with Places API enabled
//   GOOGLE_PLACE_ID        — this shop's Place ID
//
// Docs: https://developers.google.com/maps/documentation/places/web-service/place-details

export interface GoogleReview {
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number;
  text: string;
  relativeTimeDescription: string;
}

export interface GooglePlaceReviews {
  overallRating: number;
  totalReviewCount: number;
  reviews: GoogleReview[];
  googleMapsUrl: string;
}

export async function getGoogleReviews(): Promise<GooglePlaceReviews | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    // Not configured yet — the component using this should render a
    // graceful placeholder rather than throwing, since the real Place ID
    // may not exist until the shop's Google Business Profile is set up.
    return null;
  }

  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', 'rating,user_ratings_total,reviews,url');
  url.searchParams.set('key', apiKey);

  try {
    // Cache for an hour — reviews don't need to be real-time, and this
    // keeps requests well within the Places API's free tier.
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    const data = await res.json();
    if (data.status !== 'OK' || !data.result) return null;

    const result = data.result;
    const reviews: GoogleReview[] = (result.reviews ?? [])
      .slice(0, 5)
      .map((r: any) => ({
        authorName: r.author_name,
        authorPhotoUrl: r.profile_photo_url ?? null,
        rating: r.rating,
        text: r.text,
        relativeTimeDescription: r.relative_time_description,
      }));

    return {
      overallRating: result.rating ?? 0,
      totalReviewCount: result.user_ratings_total ?? 0,
      reviews,
      googleMapsUrl: result.url ?? `https://search.google.com/local/reviews?placeid=${placeId}`,
    };
  } catch {
    return null;
  }
}