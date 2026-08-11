"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadBikeImage, deleteBikeImage } from "../image-actions";

type Image = {
  id: string;
  url: string;
  altText: string | null;
  position: number;
};

export function ImageManager({
  bikeId,
  images,
}: {
  bikeId: string;
  images: Image[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      await uploadBikeImage(bikeId, formData);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(imageId: string, url: string) {
    setDeletingId(imageId);
    setError(null);
    try {
      await deleteBikeImage(bikeId, imageId, url);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <p className="text-xs tracking-wide text-graphite mb-2">PHOTOS</p>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative border border-line rounded overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.altText ?? ""}
                className="w-full h-24 object-cover"
              />
              <button
                type="button"
                onClick={() => handleDelete(img.id, img.url)}
                disabled={deletingId === img.id}
                className="absolute top-1 right-1 bg-frame text-paper text-[10px] px-1.5 py-0.5 rounded hover:bg-murram disabled:opacity-50"
              >
                {deletingId === img.id ? "..." : "REMOVE"}
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="text-xs text-graphite"
      />
      {uploading && (
        <p className="text-xs text-graphite mt-1">Uploading...</p>
      )}
      {error && (
        <p className="text-sm text-murram mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}