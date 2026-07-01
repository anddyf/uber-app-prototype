// src/app/signin/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");

    const res = await signIn("credentials", {
      redirect: false,           // let us handle errors here
      email,
      password,
      callbackUrl: "/",          // where to go on success
    });

    if (res?.error) setError("Invalid credentials");
    else if (res?.ok) window.location.href = res.url ?? "/";
  }

  return (
    <main className="min-h-screen bg-[--color-bg] text-[--color-text]">
      <section className="container py-12">
        <h1 className="text-2xl font-bold mb-6">Sign in</h1>
        <form onSubmit={onSubmit} className="card max-w-[28rem] space-y-4">
          <div className="grid gap-2">
            <label className="text-sm text-[--color-muted]">Email</label>
            <input name="email" className="input" placeholder="admin@example.com" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm text-[--color-muted]">Password</label>
            <input name="password" type="password" className="input" placeholder="secret123" />
          </div>
          <button className="btn-primary" type="submit">Sign in</button>
          {error && <p className="text-danger-500 text-sm">Invalid credentials</p>}
        </form>
      </section>
    </main>
  );
}