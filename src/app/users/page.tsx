import { db } from "@/lib/db";
import { deleteUser } from "./actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

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

  const users = await db.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
      <main className="p-10">

      <ul className="space-y-2">
        {users.map((u) => (

          <li key={u.id} className="border p-2 rounded flex items-center justify-between">
            <div>
              <strong>{u.name}</strong> — {u.email}
            </div>
            
            <form
              action={async () => {
                "use server";
                await deleteUser(u.id);
              }}
            >
              <button
                type="submit"
                className="text-sm rounded px-3 py-1 border hover:bg-gray-50"
              >
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}