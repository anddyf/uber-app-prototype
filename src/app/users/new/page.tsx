"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
});

export default function NewUserPage() {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: any) {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSuccess(true);
      reset();
    }
  }

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">Add New User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("name")}
            placeholder="Name"
            className="border p-2 rounded w-full"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message as string}</p>
          )}
        </div>

        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="border p-2 rounded w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message as string}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create User
        </button>

        {success && <p className="text-green-600">✅ User added!</p>}
      </form>
    </main>
  );
}
