import { createClient } from "@supabase/supabase-js";

// Server-only client using the secret key (bypasses RLS entirely).
// NEVER import this into a client component, and never prefix either of
// these env vars with NEXT_PUBLIC_ -- that would ship full admin access
// to every visitor's browser.
//
// Used only inside app/admin/bikes/image-actions.ts, which itself only
// runs from server actions gated behind a staff session check.

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const BIKE_IMAGES_BUCKET = "bike-images";