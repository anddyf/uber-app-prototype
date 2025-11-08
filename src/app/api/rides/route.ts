import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth-helpers";
import { z } from "zod";

const RideSchema = z.object({
  origin: z.string().min(2),
  destination: z.string().min(2),
  priceCents: z.number().int().min(0),
  riderId: z.string().min(1),
  driverId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    await requireApiAuth(); // 🔒 ensure signed in

    const json = await req.json();
    const parsed = RideSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { origin, destination, priceCents, riderId, driverId } = parsed.data;

    const users = await db.user.findMany({
      where: { id: { in: [riderId, driverId] } },
      select: { id: true },
    });
    if (users.length !== 2) {
      return NextResponse.json({ error: "Rider or driver not found" }, { status: 404 });
    }

    const ride = await db.ride.create({
      data: { origin, destination, priceCents, riderId, driverId },
    });

    return NextResponse.json(ride, { status: 201 });
  } catch (e: any) {
    if (e?.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}