// lib/practice-modes.ts — Practice mode labels and reusable mode metadata.

import type { PracticeMode } from "@/lib/types";

export const MODE_CONFIG = {
  "2": { labels: ["Start", "Finish"] },
  "2b": { labels: ["Start", "Halfway"] },
  "3": { labels: ["Start", "Halfway", "Finish"] },
} satisfies Record<PracticeMode, { labels: string[] }>;

export function getModeLabels(mode: PracticeMode): string[] {
  return MODE_CONFIG[mode].labels;
}

export function getModeTitle(mode: PracticeMode): string {
  if (mode === "2b") {
    return "Start to Halfway";
  }
  if (mode === "3") {
    return "Start to Halfway to Finish";
  }
  return "Start to Finish";
}
