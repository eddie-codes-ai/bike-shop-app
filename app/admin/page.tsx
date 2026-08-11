import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

// Middleware already redirects obviously-logged-out visitors, but that was
// only a lightweight cookie check. This does the real, authoritative
// lookup against the database — defense in depth, and it's also how we
// actually get the signed-in user's name/role to display.

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <p className="font-bold text-frame">
            RIDGEBACK
            <span className="ml-2 font-normal text-xs tracking-[0.2em] text-graphite align-middle">
              ADMIN
            </span>
          </p>
          <nav className="flex items-center gap-4 text-xs tracking-wide text-graphite">
            <Link href="/admin/bikes" className="hover:text-murram transition-colors">
              BIKES
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-graphite">
            {session.user.name} &middot; {session.user.role}
          </span>
          <SignOutButton />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-xs tracking-[0.15em] text-murram font-semibold mb-2">
          SIGNED IN
        </p>
        <h1 className="text-2xl font-bold text-frame mb-4">
          Welcome, {session.user.name}.
        </h1>
        <p className="text-sm text-graphite">
          Bike inventory management, order handling, and staff invites are
          coming next in Stage 3. For now, this confirms your account and
          session are working correctly end to end.
        </p>
      </main>
    </div>
  );
}