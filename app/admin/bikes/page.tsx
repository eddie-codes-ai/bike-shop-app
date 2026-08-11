import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatKES } from "@/lib/format";
import { SignOutButton } from "@/components/SignOutButton";

export default async function AdminBikesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/login");

  // Unlike the storefront's getBikes(), this shows EVERY bike regardless
  // of `active` -- staff need to see and manage discontinued/hidden
  // inventory too, not just what customers can currently buy.
  const bikes = await prisma.bike.findMany({
    orderBy: { createdAt: "desc" },
    include: { variants: true },
  });

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-bold text-frame">
            RIDGEBACK
            <span className="ml-2 font-normal text-xs tracking-[0.2em] text-graphite align-middle">
              ADMIN
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-xs tracking-wide text-graphite">
            <Link href="/admin/bikes" className="text-murram font-semibold">
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

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-frame">Bikes</h1>
          <Link
            href="/admin/bikes/new"
            className="bg-frame text-paper text-xs font-semibold tracking-wide px-4 py-2 rounded hover:opacity-90 transition-opacity"
          >
            + NEW BIKE
          </Link>
        </div>

        {bikes.length === 0 ? (
          <p className="text-sm text-graphite border border-dashed border-line rounded p-8 text-center">
            No bikes yet. Add your first one to get started.
          </p>
        ) : (
          <div className="border border-line rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-panel text-left text-xs tracking-wide text-graphite">
                  <th className="px-4 py-3 font-medium">NAME</th>
                  <th className="px-4 py-3 font-medium">CATEGORY</th>
                  <th className="px-4 py-3 font-medium">CONDITION</th>
                  <th className="px-4 py-3 font-medium text-right">PRICE</th>
                  <th className="px-4 py-3 font-medium text-right">STOCK</th>
                  <th className="px-4 py-3 font-medium">STATUS</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {bikes.map((bike) => {
                  const totalStock = bike.variants.reduce(
                    (sum, v) => sum + v.stockQuantity,
                    0
                  );
                  return (
                    <tr key={bike.id} className="border-t border-line">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-frame">{bike.name}</p>
                        <p className="text-xs text-graphite">{bike.brand}</p>
                      </td>
                      <td className="px-4 py-3 text-graphite">{bike.category}</td>
                      <td className="px-4 py-3 text-graphite">{bike.condition}</td>
                      <td className="px-4 py-3 text-right text-frame">
                        {formatKES(Number(bike.basePrice))}
                      </td>
                      <td className="px-4 py-3 text-right text-frame">
                        {totalStock}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            bike.active
                              ? "bg-highland/10 text-highland"
                              : "bg-line text-graphite"
                          }`}
                        >
                          {bike.active ? "ACTIVE" : "HIDDEN"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/bikes/${bike.id}`}
                          className="text-xs text-murram hover:underline"
                        >
                          EDIT
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}