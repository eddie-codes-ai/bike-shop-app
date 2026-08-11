import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

// No baseURL needed — the client and the /api/auth/* routes are served
// from the same Next.js app, so relative requests just work in both dev
// and production.
//
// inferAdditionalFields<typeof auth>() pulls in the `role` field we added
// on the server side (lib/auth.ts) so `session.user.role` is correctly
// typed here too, instead of showing up as `unknown`.

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signOut, useSession } = authClient;