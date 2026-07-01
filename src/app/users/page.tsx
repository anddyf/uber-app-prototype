import { db } from "@/lib/db";
import { deleteUser } from "./actions";

export default async function UsersPage() {
  const users = await db.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      <ul className="space-y-2">
        {users.map((u) => (
          <li key={u.id} className="border p-2 rounded flex items-center justify-between">
            <div>
              <strong>{u.name}</strong> — {u.email}
            </div>

            {/* A tiny form that calls the server action */}
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