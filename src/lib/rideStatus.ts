// src/lib/rideStatus.ts
import type { RideStatus } from "@prisma/client";

const ALLOWED_TRANSITIONS: Record<RideStatus, RideStatus[]> = {
  REQUESTED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

export function canTransition(from: RideStatus, to: RideStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}