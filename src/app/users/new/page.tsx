"use client";

import { useState } from "react";

export default function NewUserPage() {
  const [message, setMessage] = useState("");

  async function onSubmit(formData: FormData) {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
      }),
    });
    setMessage(res.ok ? "✅ User added!" : "⚠️ Failed");
  }

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">Add New User</h1>

      <form action={onSubmit} className="form-card">
        <div className="form-field">
          <label className=" text-ash-200">Name</label>
          <input name="name" className="form-input" placeholder="Jane Doe" />
        </div>

        <div className="form-field">
          <label className="form-label">Email</label>
          <input name="email" className="form-input" placeholder="jane@acme.com" />
        </div>

        <button type="submit" className="btn-primary">Create User</button>

        {message && <p className="msg-success">{message}</p>}
      </form>
    </main>
  );
}
