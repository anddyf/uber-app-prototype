// src/lib/roles.ts

/**
 * Simple role helpers — expand later if you add multiple roles.
 */
export function isAdmin(role?: string | null): boolean {
  return role === "admin" || role === "ADMIN";
}

export function isDriver(role?: string | null): boolean {
  return role === "driver" || role === "DRIVER";
}

export function isRider(role?: string | null): boolean {
  return role === "rider" || role === "RIDER";
}

/**
 * You can easily add more logic later, e.g.:
 * export const canManageUsers = (role?: string) => role === "admin";
 */
