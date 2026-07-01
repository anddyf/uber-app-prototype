import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const users = await db.user.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  return Response.json(users);
}