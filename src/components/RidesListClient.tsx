"use client";
import { useState, useEffect } from "react";
import type { RideStatus } from "@prisma/client";
import { canTransition } from "@/lib/rideStatus";
import { deleteRide, updateRideStatus, updateRideStatusFromForm } from "@/app/rides/actions";

type Ride = {
  id: string;
  origin: string;
  destination: string;
  priceCents: number;
  rideStatus: RideStatus;
  riderId: string;
  driverId: string;
  rider: { name: string } | null;
  driver: { name: string } | null;
};

export default function RidesListClient({ initialRides,  userId,
  isAdmin }: {
  initialRides: Ride[];
  userId: string | undefined;
  isAdmin: boolean;
}) {
  const [rides, setRides] = useState(initialRides);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const res = await fetch("/api/rides/list");
      const freshRides = await res.json();
      setRides(freshRides);
    },  1800000);
    return () => clearInterval(intervalId);
  }, []);

  return ( 
    <div className="grid gap-4">   
      {rides.map((r) => {
        const isDriverOfThisRide = userId === r.driverId;
        const isRiderOfThisRide = userId === r.riderId;

        if (isDriverOfThisRide || isRiderOfThisRide || isAdmin) {
          const allStatuses: RideStatus[] = ["REQUESTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
          const allowedNextStatuses = allStatuses.filter((candidate) => {
            const transitionValid = canTransition(r.rideStatus, candidate);
            const authorized = candidate === "CANCELLED"
              ? (isAdmin || isDriverOfThisRide || isRiderOfThisRide)
              : (isAdmin || isDriverOfThisRide);
            return transitionValid && authorized;
          });
          console.log(r)

          return (
            <article key={r.id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{r.origin} → {r.destination}</div>
                  <div className="text-[--color-muted] text-sm">
                    Rider: {r.rider?.name ?? "(deleted)"} • Driver: {r.driver?.name ?? "(deleted)"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-semibold">${(r.priceCents / 100).toFixed(2)}</div>
                  <form action={deleteRide.bind(null, r.id)}>
                    <button type="submit" className="border-2 rounded px-3 py-1 cursor-pointer">Delete</button>
                  </form>
                  <form action={updateRideStatusFromForm.bind(null, r.id)}>
                    <select name="status" defaultValue="">
                      {allowedNextStatuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <button type="submit">Update</button>
                  </form>
                </div>
              </div>
            </article>
          );
        }
      })}
        {rides.length === 0 && <p className="text-[--color-muted]">No rides found for this filter.</p>}
    </div>
  );
}