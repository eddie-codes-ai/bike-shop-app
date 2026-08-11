"use client";

import Link from "next/link";
import { BikeForm } from "../BikeForm";
import { createBike } from "../actions";

export default function NewBikePage() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line px-6 py-4">
        <Link
          href="/admin/bikes"
          className="text-xs text-graphite hover:text-murram"
        >
          &larr; BACK TO BIKES
        </Link>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-xl font-bold text-frame mb-6">New bike</h1>
        <BikeForm
          submitLabel="CREATE BIKE"
          onSubmit={async (values) => {
            await createBike(values as Parameters<typeof createBike>[0]);
          }}
        />
      </main>
    </div>
  );
}