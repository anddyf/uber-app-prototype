// src/components/UsersListClient.tsx
"use client";

import { useState, useMemo } from "react";
import { deleteUser } from "../app/users/actions";
import  useDebounce  from "../lib/useDebounce"

type U = { id: string; name: string; email: string };

export default function UsersListClient({ users }: { users: U[] }) {
  const [search, setSearch] = useState("");
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const debouncedSearch = useDebounce(search, 1000); // use your hook here

  const filteredUsers = useMemo(() => {
    // filter `users` by name/email containing debouncedSearch (case-insensitive)
    let newUsers = [...users].sort((a,b) => a.name.localeCompare(b.name));
    let filterOut;
        filterOut = newUsers.filter((user) => {
            let merge = user.name + " " + user.email;
            let name= merge.toLowerCase()
            let searchName = debouncedSearch.toLowerCase()
            if(name.includes(searchName)){
                return user
            }
        });
    return filterOut;
  }, [users, debouncedSearch]); 

  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={handleInput}
        className="input mb-4"
      />

      <ul className="space-y-2">
        {filteredUsers.map((u) => (
          <li key={u.id} className="border p-2 rounded flex items-center justify-between">
            <div>
              <strong>{u.name}</strong> — {u.email}
            </div>
            <form action={async () => { await deleteUser(u.id); }}>
              <button type="submit" className="text-sm rounded px-3 py-1 border hover:bg-gray-50">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>

      {filteredUsers.length === 0 && <p className="text-[--color-muted]">No users match your search.</p>}
    </div>
  );
}