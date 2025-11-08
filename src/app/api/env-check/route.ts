// src/app/api/env-check/route.ts
export async function GET() {
  return Response.json({
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    DATABASE_URL: !!process.env.DATABASE_URL,
  });
}
