import { db } from "@/lib/db";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import UsersListClient  from "../../components/UsersListClient";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main className="p-10">
        <a className="btn-primary" href="/signin">Sign in</a>
      </main>
    );
  }

  const me = await db.user.findUnique({
    where: { id: session.user?.id ?? "" },
    select: { role: true },
  });

  if (!me || me.role !== "ADMIN") {
    return (
      <main className="p-10">
        <p>You are not authorized to view this page.</p>
      </main>
    );
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true }, // exactly what UsersListClient's `U` type needs — nothing more, nothing less
  });

  return (
      <main className="p-10">
      <UsersListClient users={users} />
    </main>
  );
}