"use client";

import { useState, useRef } from "react";
import { toast } from "@/lib/client-toast";


export default function NewUserClient() {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(formData: FormData) {
    if (submitting) return;
    setSubmitting(true);
    setErrors({});

    // ---- simple client-side checks (mirror API) ----
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();

    const nextErrors: typeof errors = {};
    if (!name) nextErrors.name = "Name is required";
    if (!email) nextErrors.email = "Email is required";
    // very light email check; API will do the real validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email";
    }
    if (nextErrors.name || nextErrors.email) {
      setErrors(nextErrors);
      setSubmitting(false);
      return;
    }

    // ---- send to API ----
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    setSubmitting(false);

    if (res.ok) {
      toast("User created", "success");
      formRef.current?.reset();
      setErrors({});
      return;
    }

    // Surface server message (409 duplicate, 400 invalid, etc)
    let msg = "Failed to create user";
    try {
      const j = await res.json();
      if (j?.error) msg = j.error as string;
    } catch {}
    toast(msg, "error");

    // Optional: map a couple common server errors to fields
    if (/email/i.test(msg)) setErrors((e) => ({ ...e, email: msg }));
  }

  return (
    <main className="min-h-screen bg-[--color-bg] text-[--color-text]">
      <section className="container py-12">
        <h1 className="text-2xl font-bold mb-6">Add New User</h1>

        <form
          id="user-form"
          ref={formRef}
          action={onSubmit}
          className="card max-w-[--size-narrow] space-y-6"
          noValidate
        >
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm text-[--color-muted]">
              Name
            </label>
            <input
              id="name"
              name="name"
              className={`input ${errors.name ? "border-danger-500" : ""}`}
              placeholder="Jane Doe"
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-danger-500 text-sm">
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm text-[--color-muted]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`input ${errors.email ? "border-danger-500" : ""}`}
              placeholder="jane@acme.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-danger-500 text-sm">
                {errors.email}
              </p>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : "Create User"}
          </button>
        </form>
      </section>
    </main>
  );
}