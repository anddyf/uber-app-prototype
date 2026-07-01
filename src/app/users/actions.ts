"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function deleteUser(id: string) {
  if (!id) return;

  // 1) Must be signed in
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized: admin only");

  // 2) Look up *fresh* role from DB (don’t trust possibly-stale JWT)
  const me = await db.user.findUnique({
    where: { id: (session.user as any)?.id ?? "" }, // or use email if you didn't wire id
    select: { role: true },
  });

  if (!me || me.role !== "ADMIN") {
    throw new Error("Unauthorized: admin only");
  }

  // 3) Clear dependent rides to avoid FK errors (or use onDelete: Cascade in Prisma)
  await db.ride.deleteMany({ where: { OR: [{ riderId: id }, { driverId: id }] } });

  // 4) Delete the user
  await db.user.delete({ where: { id } });

  revalidatePath("/users");
}