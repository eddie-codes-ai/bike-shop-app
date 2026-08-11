"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BikeForm, type BikeFormValues } from "../BikeForm";
import { updateBike, deleteBike } from "../actions";

export function EditBikeForm({
  bikeId,
  initialValues,
}: {
  bikeId: string;
  initialValues: Partial<BikeFormValues>;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    if (!confirm("Delete this bike permanently? This cannot be undone.")) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteBike(bikeId);
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : "Couldn't delete this bike -- it may have order history attached. Try unchecking \"Visible on storefront\" instead."
      );
      setDeleting(false);
    }
  }

  return (
    <div>
      <BikeForm
        initialValues={initialValues}
        submitLabel="SAVE CHANGES"
        onSubmit={async (values) => {
          await updateBike(bikeId, values as Parameters<typeof updateBike>[1]);
          router.push("/admin/bikes");
        }}
      />

      <div className="mt-10 pt-6 border-t border-line">
        <p className="text-xs tracking-wide text-graphite mb-2">DANGER ZONE</p>
        {deleteError && (
          <p className="text-sm text-murram mb-2" role="alert">
            {deleteError}
          </p>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs text-murram border border-murram rounded px-3 py-1.5 hover:bg-murram hover:text-paper transition-colors disabled:opacity-50"
        >
          {deleting ? "DELETING..." : "DELETE BIKE"}
        </button>
        <p className="text-xs text-graphite mt-2">
          If this bike has any order history, deleting will fail. Uncheck
          &quot;Visible on storefront&quot; above instead to hide it without
          losing records.
        </p>
      </div>
    </div>
  );
}