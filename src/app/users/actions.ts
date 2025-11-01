"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function deleteUser(id: string) {
  if (!id) return;

  await db.user.delete({ where: { id } });

  // Refresh the /users list so it reflects the deletion
  revalidatePath("/users");
}