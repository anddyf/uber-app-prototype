import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google"; // <- comment out if not used
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  // You can keep the adapter (useful if you later add OAuth providers),
  // but sessions will be JWT-based.
  adapter: PrismaAdapter(db),

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const email = String(creds?.email || "").toLowerCase().trim();
        const pw = String(creds?.password || "");
        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;
        const ok = await bcrypt.compare(pw, user.passwordHash);
        return ok ? { id: user.id, email: user.email, name: user.name } : null;
      },
    }),

    // If you haven't set GOOGLE_CLIENT_ID/SECRET yet, remove/comment Google:
    // Google({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! }),
  ],

  pages: { signIn: "/signin" },

  // 👉 Required for Credentials in v4:
  session: { strategy: "jwt" },

  // (optional) include a JWT callback to attach more fields
    callbacks: {
    async jwt({ token, user }) {
        if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;  // <-- include role
        }
        return token;
    },
    async session({ session, token }) {
        if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;  // <-- expose role
        }
        return session;
    },
    },
};
