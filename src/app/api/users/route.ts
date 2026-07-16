// src/app/api/users/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { isAdmin } from "@/lib/roles";
import { z } from "zod";
import bcrypt from "bcrypt";

const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "DRIVER", "RIDER"]),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role as string | undefined;

  if (!session || !isAdmin(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = UserSchema.safeParse({
    name: String(body?.name ?? ""),
    email: String(body?.email ?? ""),
    password: String(body?.password ?? ""),
    role: String(body?.role ?? ""),
  });
  if (!parsed.success) {
    const errs = parsed.error.flatten().fieldErrors;
    return NextResponse.json(
      {
        error:
          errs.name?.[0] ||
          errs.email?.[0] ||
          errs.password?.[0] ||
          errs.role?.[0] ||
          "Invalid input",
      },
      { status: 400 }
    );
  }

  try {
    const { name, email, password, role: newRole } = parsed.data;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { name, email, passwordHash, role: newRole },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (e: any) {
    if (String(e).includes("Unique constraint")) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    console.error("POST /api/users error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}