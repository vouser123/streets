// lib/practice-replay.test.ts — Unit tests for replay event generation and tolerance results.

import { describe, expect, it } from "vitest";
import { buildReplayPlan } from "@/lib/practice-replay";

describe("buildReplayPlan", () => {
  const timing = {
    clearTime: 4,
    fullTime: 8,
    tolerance: 0.5,
  };

  it("marks matching user and reference times as within tolerance", () => {
    const plan = buildReplayPlan("3", [0, 4, 8], timing, 1, 1);
    expect(plan.results.map((result) => result.withinTolerance)).toEqual([true, true]);
    expect(plan.referenceEvents.map((event) => event.feedbackType)).toEqual([
      "acceptable",
      "acceptable",
    ]);
  });

  it("marks out-of-range times as outside tolerance", () => {
    const plan = buildReplayPlan("2", [0, 9], timing, 1, 1);
    expect(plan.results[0]?.withinTolerance).toBe(false);
    expect(plan.referenceEvents[0]?.feedbackType).toBe("outside");
  });
});
