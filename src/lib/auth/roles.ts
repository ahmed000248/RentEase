import type { UserDoc, UserRole } from "@/lib/firebase/types";

/**
 * Checks if a user has a specific role, handling string trimming,
 * null/undefined safety, and case-insensitive comparison.
 */
export function hasRole(user: UserDoc | { roles?: string[] } | null | undefined, role: string): boolean {
  if (!user || !user.roles || !Array.isArray(user.roles)) return false;
  const target = role.trim().toLowerCase();
  return user.roles.some((r) => typeof r === "string" && r.trim().toLowerCase() === target);
}

/**
 * Sanitizes an array of role strings by trimming whitespace and newlines,
 * filtering out invalid entries.
 */
export function sanitizeRoles(roles: unknown): UserRole[] {
  if (!Array.isArray(roles)) return [];
  return roles
    .filter((r): r is string => typeof r === "string")
    .map((r) => r.trim() as UserRole)
    .filter((r) => r.length > 0);
}
