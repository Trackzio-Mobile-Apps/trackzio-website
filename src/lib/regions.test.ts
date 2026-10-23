import { describe, expect, it } from "vitest";
import { matchRegion, regionsForCountry } from "@/lib/regions";

describe("regions", () => {
  it("lists states for countries that have a dropdown", () => {
    expect(regionsForCountry("India")).toContain("Gujarat");
    expect(regionsForCountry("United States")).toContain("Texas");
    expect(regionsForCountry("France")).toEqual([]);
    expect(regionsForCountry("")).toEqual([]);
  });

  it("matches a state by name or subdivision code", () => {
    const india = regionsForCountry("India");
    const unitedStates = regionsForCountry("United States");
    expect(matchRegion(india, "gujarat", "IN")).toBe("Gujarat");
    expect(matchRegion(india, "GJ", "IN")).toBe("Gujarat");
    expect(matchRegion(india, "IN-MH", "IN")).toBe("Maharashtra");
    expect(matchRegion(unitedStates, "US-TX", "US")).toBe("Texas");
    expect(matchRegion(india, "Not a state", "IN")).toBe("");
  });
});