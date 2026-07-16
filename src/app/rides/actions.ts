"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { revalidatePath } from "next/cache";

export async function deleteRide(id: string) {
  if (!id) return;

    // 1) Must be signed in
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized: admin only");
  
  // 2) Fetch the ride itself — you need its riderId/driverId to check ownership
  const ride = await db.ride.findUnique({
    where: { id },
    select: { riderId: true, driverId: true },
  });
  if (!ride) throw new Error("Ride not found");

  // 3) Fetch the requester's role AND id fresh from DB
  //    (you'll need both: role for the admin check, id for the ownership check)

  const me = await db.user.findUnique({
    where: { id: session.user?.id ?? "" } // or use email if you didn't wire id
  });
if (!me) throw new Error("Unauthorized");

if (me.role === "ADMIN" || me.id === ride.riderId || me.id === ride.driverId) {
  await db.ride.delete({ where: { id } });
  revalidatePath("/rides");
}
else {
  throw new Error("Unauthorized: only current rider, driver, or Admin allowed");
}
}
