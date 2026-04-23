// lib/practice-labels.ts — Shared display labels and formatting helpers.

import { getModeTitle } from "@/lib/practice-modes";
import type { PracticeMode, TextSize } from "@/lib/types";

export function formatSeconds(seconds: number | null): string {
  if (seconds === null || !Number.isFinite(seconds)) {
    return "Not set";
  }
  return `${seconds.toFixed(2)} sec`;
}

export function getNextActionLabel(mode: PracticeMode, stageIndex: number): string {
  if (stageIndex === 0) {
    return "Begin";
  }
  const labels = {
    "2": ["Finish"],
    "2b": ["Halfway"],
    "3": ["Halfway", "Finish"],
  } as const;
  const nextLabel = labels[mode][stageIndex - 1];
  return nextLabel ? `Mark ${nextLabel}` : "Replay";
}

export function describeMode(mode: PracticeMode): string {
  return `${getModeTitle(mode)} practice`;
}

export function getTextSizeScale(size: TextSize): number {
  if (size === "smaller") return 16 / 18;
  if (size === "large") return 1.15;
  if (size === "largest") return 1.3;
  if (size === "huge") return 1.5;
  if (size === "xl") return 2;
  return 1;
}
