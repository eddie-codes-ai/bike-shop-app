import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

// Server-side Better Auth config. This is the single source of truth for
// how OWNER/STAFF sessions are created and validated — the API route
// handler and the client hooks both talk through this.
//
// No signUp / self-registration is exposed anywhere in the app. Accounts
// are created directly (via the seed script, or later an "invite staff"
// admin action) — never through a public form. Better Auth still needs
// email+password enabled to issue credentials at all, we just never wire
// up a public sign-up page for it.

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    // No public sign-up route will call this, but Better Auth requires
    // the flag to be present to allow credential accounts to be created
    // at all (including via the admin API / seed script).
    disableSignUp: false,
  },

  session: {
    // How long a login lasts before requiring a fresh sign-in.
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh the expiry once per day of activity
  },

  user: {
    // Expose `role` on the session/user object returned to the client,
    // so middleware and UI can read req.session.user.role directly
    // without a separate Prisma lookup on every request.
    additionalFields: {
      role: {
        type: "string",
        required: true,
        // `role` has no default in the Prisma schema on purpose, so it
        // MUST be supplied whenever an account is created — input: true
        // allows that. This is safe specifically because there is no
        // public sign-up page anywhere in this app; the only callers are
        // the seed script and (later) a trusted "invite staff" admin
        // action, never an end-user-facing form.
        input: true,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;