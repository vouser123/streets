// lib/practice-labels.test.ts — Unit tests for shared label helpers.

import { describe, expect, it } from "vitest";
import { getNextActionLabel } from "@/lib/practice-labels";

describe("getNextActionLabel", () => {
  it("starts with Begin", () => {
    expect(getNextActionLabel("3", 0)).toBe("Begin");
  });

  it("uses marker labels for later stages", () => {
    expect(getNextActionLabel("3", 1)).toBe("Mark Halfway");
    expect(getNextActionLabel("3", 2)).toBe("Mark Finish");
  });
});
