import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

/** Throws if not signed in. Use in API routes. */
export async function requireApiAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    const err = new Error("Unauthorized");
    (err as any).status = 401;
    throw err;
  }
  return session;
}

/** Returns session or null; handy in server pages */
export async function getSession() {
  return getServerSession(authOptions);
}
