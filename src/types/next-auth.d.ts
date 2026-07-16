import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // or better: "ADMIN" | "DRIVER" | "RIDER" if you want to be precise
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    // what fields does `authorize()` actually return, beyond the defaults?
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    // what fields did you attach to `token` in the jwt callback?
    id: string;
    role: string;
  }
}