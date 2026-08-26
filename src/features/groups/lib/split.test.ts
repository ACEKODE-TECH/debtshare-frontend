import { describe, expect, it } from "vitest";

import { computeEqualShares } from "./split";

describe("computeEqualShares", () => {
  it("splits an exact-cents amount evenly", () => {
    const shares = computeEqualShares(60, ["a", "b", "c"], "a");
    expect(shares.get("a")).toBe(20);
    expect(shares.get("b")).toBe(20);
    expect(shares.get("c")).toBe(20);
    expect(sum(shares)).toBe(60);
  });

  it("hands leftover cents to the payer", () => {
    // 10 / 3 = 3.33 base, 1 cent leftover → payer gets 3.34
    const shares = computeEqualShares(10, ["a", "b", "c"], "b");
    expect(shares.get("a")).toBe(3.33);
    expect(shares.get("b")).toBe(3.34);
    expect(shares.get("c")).toBe(3.33);
    expect(sum(shares)).toBeCloseTo(10, 2);
  });

  it("gives multiple leftover cents to the payer", () => {
    // 10 / 6 = 1.66 base with 4 cents leftover → payer gets 1.66 + 0.04 = 1.70
    const shares = computeEqualShares(10, ["a", "b", "c", "d", "e", "f"], "d");
    expect(shares.get("a")).toBe(1.66);
    expect(shares.get("d")).toBe(1.7);
    expect(sum(shares)).toBeCloseTo(10, 2);
  });

  it("falls back to the first member if the payer is not included", () => {
    const shares = computeEqualShares(10, ["a", "b", "c"], "z");
    expect(shares.get("a")).toBe(3.34);
    expect(shares.get("b")).toBe(3.33);
    expect(shares.get("c")).toBe(3.33);
  });

  it("returns an empty map when no members are included", () => {
    expect(computeEqualShares(60, [], "a").size).toBe(0);
  });

  it("returns an empty map when amount is zero or negative", () => {
    expect(computeEqualShares(0, ["a", "b"], "a").size).toBe(0);
    expect(computeEqualShares(-5, ["a", "b"], "a").size).toBe(0);
  });

  it("handles a single participant getting the full amount", () => {
    const shares = computeEqualShares(42.5, ["a"], "a");
    expect(shares.get("a")).toBe(42.5);
  });

  it("handles floating-point sums exactly (0.10 / 3)", () => {
    const shares = computeEqualShares(0.1, ["a", "b", "c"], "a");
    expect(shares.get("a")).toBe(0.04);
    expect(shares.get("b")).toBe(0.03);
    expect(shares.get("c")).toBe(0.03);
    expect(sum(shares)).toBeCloseTo(0.1, 2);
  });
});

function sum(map: Map<string, number>): number {
  return Array.from(map.values()).reduce((acc, v) => acc + v, 0);
}
