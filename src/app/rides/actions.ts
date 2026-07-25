"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { revalidatePath } from "next/cache";
import { canTransition } from "../../lib/rideStatus"
import type { RideStatus } from "@prisma/client";

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

export async function updateRideStatus(rideId: string, newStatus: RideStatus) {
   if (!rideId) return;

    // 1) Must be signed in
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized: admin only");
  
  // 2) Fetch the ride itself — you need its riderId/driverId to check ownership
  const ride = await db.ride.findUnique({
    where: { id: rideId },
    select: { riderId: true, driverId: true, rideStatus: true },
  });

  if (!ride) throw new Error("Ride not found");

  // 3) Fetch the requester's role AND id fresh from DB
  //    (you'll need both: role for the admin check, id for the ownership check)

  const me = await db.user.findUnique({
    where: { id: session.user?.id ?? "" } // or use email if you didn't wire id
  });

if (!me) throw new Error("Unauthorized");

const isAdmin = me.role === "ADMIN";
const isDriver = me.id === ride.driverId;
const isRider = me.id === ride.riderId;

const isAuthorized =
  newStatus === "CANCELLED"
    ? isAdmin || isDriver || isRider   // cancellation: any party
    : isAdmin || isDriver;   

if(canTransition(ride.rideStatus, newStatus)){
  if (isAuthorized) {
    await db.ride.update({ where: { id: rideId }, data: { rideStatus: newStatus} });
    revalidatePath("/rides");
  }
  else {
     throw new Error("Unauthorized: Do not have access to change status");
  }
}
else {
  throw new Error("Invalid status transition");
}
  // 1) Must be signed in
  // 2) Fetch the ride (need current rideStatus, riderId, driverId)
  // 3) Fetch `me` fresh from DB (need role, id)
  // 4) Check the transition is valid using canTransition()
  // 5) Check authorization - branches based on what newStatus is:
  //    - IN_PROGRESS or COMPLETED -> only driver or admin
  //    - CANCELLED -> rider, driver, or admin
  // 6) If both pass, update the ride's status
}

// in src/app/rides/actions.ts - add a new export
export async function updateRideStatusFromForm(rideId: string, formData: FormData) {
  const newStatus = formData.get("status") as RideStatus;
  await updateRideStatus(rideId, newStatus);
}