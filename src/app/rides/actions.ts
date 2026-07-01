"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteRide(id: string) {
  if (!id) return;
  await db.ride.delete({ where: { id } });
  revalidatePath("/rides");
}
