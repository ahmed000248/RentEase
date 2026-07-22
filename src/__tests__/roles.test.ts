import { describe, it, expect } from "vitest";
import { hasRole, sanitizeRoles } from "@/lib/auth/roles";
import type { UserDoc } from "@/lib/firebase/types";

describe("hasRole utility", () => {
  it("should match roles robustly ignoring whitespace and trailing newlines", () => {
    const userWithNewlineRole = {
      roles: ["owner\n", "tenant"],
    } as UserDoc;

    expect(hasRole(userWithNewlineRole, "owner")).toBe(true);
    expect(hasRole(userWithNewlineRole, "OWNER")).toBe(true);
    expect(hasRole(userWithNewlineRole, "tenant")).toBe(true);
    expect(hasRole(userWithNewlineRole, "admin")).toBe(false);
  });

  it("should return false for null, undefined, or invalid roles", () => {
    expect(hasRole(null, "owner")).toBe(false);
    expect(hasRole(undefined, "owner")).toBe(false);
    expect(hasRole({ roles: [] } as unknown as UserDoc, "owner")).toBe(false);
  });
});

describe("sanitizeRoles utility", () => {
  it("should trim and filter role strings", () => {
    const raw = [" owner\n", "tenant ", "", 123, null];
    const cleaned = sanitizeRoles(raw);
    expect(cleaned).toEqual(["owner", "tenant"]);
  });
});
