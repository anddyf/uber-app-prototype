// src/app/rides/new/_client.tsx
"use client";

import { useEffect, useState } from "react";
import { z } from "zod";

type U = { id: string; name: string };

const RideSchema = z.object({
  origin: z.string().min(2, "Enter an origin"),
  destination: z.string().min(2, "Enter a destination"),
  priceCents: z.coerce.number().int().min(0, "Price must be ≥ 0"),
  riderId: z.string().min(1, "Pick a rider"),
  driverId: z.string().min(1, "Pick a driver"),
});

export default function NewRideClient() {
  const [users, setUsers] = useState<U[]>([]);
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/users/list")
      .then((r) => r.json())
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  async function onSubmit(formData: FormData) {
    setErrors({});
    setMessage("");

    const raw = {
      origin: String(formData.get("origin") || ""),
      destination: String(formData.get("destination") || ""),
      priceCents: formData.get("priceCents"),
      riderId: String(formData.get("riderId") || ""),
      driverId: String(formData.get("driverId") || ""),
    };

    const parsed = RideSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed.error.flatten().fieldErrors)) {
        if (v && v[0]) fieldErrors[k] = v[0];
      }
      setErrors(fieldErrors);
      return;
    }

    const res = await fetch("/api/rides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (res.ok) {
      setMessage("✅ Ride created");
      (document.getElementById("ride-form") as HTMLFormElement)?.reset();
    } else {
      const text = await res.text().catch(() => "");
      setMessage(`⚠️ ${text || "Failed to create"}`);
    }
  }

  return (
    <main className="min-h-screen bg-[--color-bg] text-[--color-text]">
      <section className="container py-9">
        <h1 className="text-2xl font-bold mb-7">New Ride</h1>

        <form id="ride-form" action={onSubmit} className="card max-w-[--size-narrow] space-y-7">
          <div className="grid gap-2">
            <label className="text-sm text-[--color-muted]">Origin</label>
            <input name="origin" className="input" placeholder="123 Main St" />
            {errors.origin && <p className="text-danger-500 text-sm">{errors.origin}</p>}
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-[--color-muted]">Destination</label>
            <input name="destination" className="input" placeholder="456 Park Ave" />
            {errors.destination && <p className="text-danger-500 text-sm">{errors.destination}</p>}
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-[--color-muted]">Price (cents)</label>
            <input name="priceCents" type="number" min={0} className="input" placeholder="1299" />
            {errors.priceCents && <p className="text-danger-500 text-sm">{errors.priceCents}</p>}
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-[--color-muted]">Rider</label>
            <select name="riderId" className="input">
              <option value="">Select rider…</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            {errors.riderId && <p className="text-danger-500 text-sm">{errors.riderId}</p>}
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-[--color-muted]">Driver</label>
            <select name="driverId" className="input">
              <option value="">Select driver…</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            {errors.driverId && <p className="text-danger-500 text-sm">{errors.driverId}</p>}
          </div>

          <button type="submit" className="btn-primary">Create Ride</button>
          {message && <p className="text-success-500">{message}</p>}
        </form>
      </section>
    </main>
  );
}
