"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

export default function ProfileMenu({ label, role }: { label: string; role?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button className="btn" onClick={() => setOpen((o) => !o)}>
        <span className="mr-2">{label}</span>
        <span className="px-2 py-0.5 rounded bg-[--color-surface-strong] text-xs border border-[--color-border]">
          {role ?? "RIDER"}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[--color-border] bg-[--color-surface] shadow-xl p-2">
          <a href="/rides" className="block px-3 py-2 rounded hover:bg-[--color-surface-strong]">My rides</a>
          <a href="/users" className="block px-3 py-2 rounded hover:bg-[--color-surface-strong]">Users</a>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block w-full text-left px-3 py-2 rounded hover:bg-[--color-surface-strong] text-danger-500"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
