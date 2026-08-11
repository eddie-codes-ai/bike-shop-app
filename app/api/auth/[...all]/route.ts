import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// This single catch-all route handles every Better Auth endpoint —
// sign-in, sign-out, session lookup, etc. — all under /api/auth/*.
// Nothing else needs to be added here; new auth features (password
// reset, etc.) are configured in lib/auth.ts, not by adding more routes.

export const { GET, POST } = toNextJsHandler(auth);