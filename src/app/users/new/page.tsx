// src/app/users/new/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import NewUserClient from "./_client";
import { isAdmin } from "@/lib/roles";

export default async function NewUserPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role as string | undefined;

  if (!session) {
    return (
      <main className="min-h-screen bg-[--color-bg] text-[--color-text]">
        <section className="container py-12">
          <p>
            You must <a className="text-brand underline" href="/signin">sign in</a> to create users.
          </p>
        </section>
      </main>
    );
  }

  if (!isAdmin(role)) {
    return (
      <main className="min-h-screen bg-[--color-bg] text-[--color-text]">
        <section className="container py-12">
          <p className="text-danger-500">Only admins can create users.</p>
        </section>
      </main>
    );
  }

  return <NewUserClient />;
}
