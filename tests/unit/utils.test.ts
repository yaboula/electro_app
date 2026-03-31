import { describe, it, expect } from "vitest";
import { formatMAD, normalizePhone, slugify, timeAgo } from "@/lib/utils";

// ── formatMAD ──────────────────────────────────────────────────────────────

describe("formatMAD", () => {
  it("formats integer amounts with MAD currency", () => {
    const result = formatMAD(1500);
    expect(result).toContain("MAD");
    expect(result).toContain("1");
  });

  it("formats zero correctly", () => {
    const result = formatMAD(0);
    expect(result).toContain("MAD");
  });

  it("formats decimal amounts", () => {
    const result = formatMAD(99.99);
    expect(result).toContain("MAD");
  });

  it("never uses USD or EUR symbols", () => {
    const result = formatMAD(500);
    expect(result).not.toContain("$");
    expect(result).not.toContain("€");
    expect(result).not.toContain("£");
  });
});

// ── normalizePhone ─────────────────────────────────────────────────────────

describe("normalizePhone", () => {
  it("normalizes local format 0612345678 to +212612345678", () => {
    expect(normalizePhone("0612345678")).toBe("+212612345678");
  });

  it("normalizes 00212 prefix to +212", () => {
    expect(normalizePhone("00212612345678")).toBe("+212612345678");
  });

  it("keeps already-normalized +212 numbers unchanged", () => {
    expect(normalizePhone("+212612345678")).toBe("+212612345678");
  });

  it("strips spaces and dashes before normalizing", () => {
    expect(normalizePhone("06 12-34 56 78")).toBe("+212612345678");
  });

  it("strips dots before normalizing", () => {
    expect(normalizePhone("06.12.34.56.78")).toBe("+212612345678");
  });
});

// ── slugify ────────────────────────────────────────────────────────────────

describe("slugify", () => {
  it("converts to lowercase", () => {
    expect(slugify("PlayStation")).toBe("playstation");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("PS5 Console")).toBe("ps5-console");
  });

  it("removes accents (NFD normalization)", () => {
    expect(slugify("Contrôleur")).toBe("controleur");
  });

  it("removes special characters", () => {
    expect(slugify("FIFA 24 (PS5)!")).toBe("fifa-24-ps5");
  });

  it("does not start or end with a hyphen", () => {
    const result = slugify("  test  ");
    expect(result).not.toMatch(/^-/);
    expect(result).not.toMatch(/-$/);
  });

  it("collapses multiple spaces to single hyphen", () => {
    expect(slugify("Grand   Theft   Auto")).toBe("grand-theft-auto");
  });
});

// ── timeAgo ───────────────────────────────────────────────────────────────

describe("timeAgo", () => {
  it("returns 'à l'instant' for very recent dates (< 1 min)", () => {
    const now = new Date();
    expect(timeAgo(now)).toBe("à l'instant");
  });

  it("returns minutes ago for recent dates", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(timeAgo(fiveMinAgo)).toBe("il y a 5min");
  });

  it("returns hours ago for dates < 24h", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(timeAgo(twoHoursAgo)).toBe("il y a 2h");
  });

  it("returns days ago for dates < 7 days", () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(timeAgo(threeDaysAgo)).toBe("il y a 3j");
  });

  it("accepts a string date", () => {
    const result = timeAgo(new Date(Date.now() - 30 * 1000).toISOString());
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
