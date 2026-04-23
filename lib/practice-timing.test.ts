// lib/practice-timing.test.ts — Unit tests for timing validation and reference mapping.

import { describe, expect, it } from "vitest";
import { getReferenceTimesForMode, getTimingRequirementMessage } from "@/lib/practice-timing";

describe("getTimingRequirementMessage", () => {
  it("requires both timing values when both are missing", () => {
    expect(
      getTimingRequirementMessage({
        clearTime: null,
        fullTime: null,
        tolerance: 0.5,
      }),
    ).toContain("both street times");
  });
});

describe("getReferenceTimesForMode", () => {
  const timing = {
    clearTime: 4.25,
    fullTime: 8.5,
    tolerance: 0.5,
  };

  it("maps two-marker mode to start and full time", () => {
    expect(getReferenceTimesForMode("2", timing)).toEqual([0, 8.5]);
  });

  it("maps halfway mode to start and clear time", () => {
    expect(getReferenceTimesForMode("2b", timing)).toEqual([0, 4.25]);
  });

  it("maps three-marker mode to start, clear, and full time", () => {
    expect(getReferenceTimesForMode("3", timing)).toEqual([0, 4.25, 8.5]);
  });
});
