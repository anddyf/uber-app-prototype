import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export const runtime = "nodejs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";


export async function GET() {
      const session = await getServerSession(authOptions);
      if (!session ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    
  const rides = await db.ride.findMany({
    orderBy: { createdAt: "desc" },
    select: {
        id: true,
        origin: true,
        destination: true,
        priceCents: true,
        rideStatus: true,
        riderId: true,
        driverId: true,
        rider: { select: {  name: true } },
        driver: { select: { name: true } },
    },
  });
  return Response.json(rides);
}