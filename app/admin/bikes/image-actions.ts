"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin, BIKE_IMAGES_BUCKET } from "@/lib/supabase-admin";

async function requireStaffSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/login");
  return session;
}

export async function uploadBikeImage(bikeId: string, formData: FormData) {
  await requireStaffSession();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    throw new Error("No file selected.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Images must be under 5MB.");
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${bikeId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BIKE_IMAGES_BUCKET)
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(BIKE_IMAGES_BUCKET).getPublicUrl(path);

  const existingCount = await prisma.bikeImage.count({ where: { bikeId } });

  await prisma.bikeImage.create({
    data: { bikeId, url: publicUrl, position: existingCount },
  });

  revalidatePath(`/admin/bikes/${bikeId}`);
  revalidatePath(`/bikes/${bikeId}`);
  revalidatePath("/");
}

export async function deleteBikeImage(
  bikeId: string,
  imageId: string,
  imageUrl: string
) {
  await requireStaffSession();

  // Pull the storage path back out of the public URL so we remove the
  // actual file, not just the database row.
  const marker = `/object/public/${BIKE_IMAGES_BUCKET}/`;
  const idx = imageUrl.indexOf(marker);
  if (idx !== -1) {
    const path = imageUrl.slice(idx + marker.length);
    await supabaseAdmin.storage.from(BIKE_IMAGES_BUCKET).remove([path]);
  }

  await prisma.bikeImage.delete({ where: { id: imageId } });

  revalidatePath(`/admin/bikes/${bikeId}`);
  revalidatePath(`/bikes/${bikeId}`);
  revalidatePath("/");
}