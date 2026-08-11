"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

// No self-serve sign-up anywhere in this app — OWNER/STAFF accounts are
// created directly via the seed script (or later, an "invite staff" admin
// action). This page only ever handles signing IN to an existing account.

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await signIn.email({ email, password });

    setLoading(false);

    if (signInError) {
      setError("Incorrect email or password.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4">
      <div className="mb-10 text-center">
        <p className="font-bold tracking-tight text-2xl text-frame">
          RIDGEBACK
          <span className="ml-2 font-normal text-sm tracking-[0.2em] text-graphite align-middle">
            CYCLES
          </span>
        </p>
      </div>

      <div className="w-full max-w-sm bg-panel border border-line rounded-md p-8">
        <p className="text-xs tracking-[0.15em] text-murram font-semibold mb-1">
          STAFF SIGN IN
        </p>
        <h1 className="text-lg font-bold text-frame mb-6">
          Admin access only
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs tracking-wide text-graphite mb-1"
            >
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-line rounded px-3 py-2 text-sm text-frame bg-paper focus:outline-none focus:ring-2 focus:ring-murram"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs tracking-wide text-graphite mb-1"
            >
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-line rounded px-3 py-2 text-sm text-frame bg-paper focus:outline-none focus:ring-2 focus:ring-murram"
            />
          </div>

          {error && (
            <p className="text-sm text-murram" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-frame text-paper rounded py-2 text-sm font-semibold tracking-wide hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-xs text-graphite">
        Lost access? Ask the shop owner to reset it for you.
      </p>
    </div>
  );
}