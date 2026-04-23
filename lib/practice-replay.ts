// lib/practice-replay.ts — Replay event generation for audio and visual playback.

import { buildReplayStageResults, getReferenceTimesForMode } from "@/lib/practice-timing";
import type { PracticeMode, ReplayPlan, TimingSettings } from "@/lib/types";

export function buildReplayPlan(
  mode: PracticeMode,
  markerTimes: number[],
  timing: TimingSettings,
  leadInSec = 1.5,
  endPadSec = 1.2,
): ReplayPlan {
  const referenceTimes = getReferenceTimesForMode(mode, timing);
  const results = buildReplayStageResults(mode, markerTimes, timing);

  const userEvents = markerTimes.map((timeSec, index) => ({
    timeSec: leadInSec + timeSec,
    type: "user" as const,
    label: index === 0 ? "Start" : results[index - 1]?.label,
  }));

  const referenceEvents = referenceTimes
    .slice(1)
    .map<ReplayPlan["referenceEvents"][number]>((timeSec, index) => ({
      timeSec: leadInSec + timeSec,
      type: "reference",
      feedbackType: results[index]?.withinTolerance ? "acceptable" : "outside",
      label: results[index]?.label,
    }));

  const maxReplayTime = Math.max(...markerTimes, ...referenceTimes) + leadInSec + endPadSec;

  return {
    userEvents,
    referenceEvents,
    results,
    maxTimeSec: maxReplayTime,
  };
}
