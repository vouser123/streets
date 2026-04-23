// lib/practice-timing.ts — Pure timing validation and reference-time helpers.

import { getModeLabels } from "@/lib/practice-modes";
import type { PracticeMode, ReplayStageResult, TimingSettings } from "@/lib/types";

export function getMissingTimingFields(timing: TimingSettings): Array<"clear" | "full"> {
  const missing: Array<"clear" | "full"> = [];
  if (!Number.isFinite(timing.clearTime) || (timing.clearTime ?? 0) <= 0) {
    missing.push("clear");
  }
  if (!Number.isFinite(timing.fullTime) || (timing.fullTime ?? 0) <= 0) {
    missing.push("full");
  }
  return missing;
}

export function hasRequiredTiming(timing: TimingSettings): boolean {
  return getMissingTimingFields(timing).length === 0;
}

export function getTimingRequirementMessage(timing: TimingSettings): string {
  const missing = getMissingTimingFields(timing);
  if (missing.length === 0) {
    return "";
  }
  if (missing.length === 2) {
    return "Enter both street times before using practice or exemplars.";
  }
  if (missing[0] === "clear") {
    return "Enter the time to clear from left before using practice or exemplars.";
  }
  return "Enter the full street time before using practice or exemplars.";
}

export function getReferenceTimesForMode(mode: PracticeMode, timing: TimingSettings): number[] {
  const clearTime = timing.clearTime ?? 0;
  const fullTime = timing.fullTime ?? 0;
  if (mode === "2") {
    return [0, fullTime];
  }
  if (mode === "2b") {
    return [0, clearTime];
  }
  return [0, clearTime, fullTime];
}

export function buildReplayStageResults(
  mode: PracticeMode,
  markerTimes: number[],
  timing: TimingSettings,
): ReplayStageResult[] {
  const labels = getModeLabels(mode);
  const reference = getReferenceTimesForMode(mode, timing);
  const tolerance = Math.max(0, timing.tolerance);

  return reference.slice(1).map((referenceTime, index) => {
    const userTime = markerTimes[index + 1] ?? null;
    const difference = userTime === null ? null : Math.abs(userTime - referenceTime);
    return {
      label: labels[index + 1] ?? `Marker ${index + 2}`,
      userTime,
      referenceTime,
      difference,
      withinTolerance: difference !== null && difference <= tolerance,
    };
  });
}
