// lib/audio-patterns.ts — Simple browser-native tone definitions for Streets cues.

import type { FeedbackToneId, UserToneId } from "@/lib/types";

export interface TonePattern {
  attackMs?: number;
  frequency?: number;
  durationMs: number;
  gain: number;
  partials?: Array<{ frequency: number; gain: number }>;
  releaseMs?: number;
  segments?: ToneSegment[];
  type?: OscillatorType;
}

export interface ToneSegment {
  durationMs: number;
  frequency?: number;
  gain?: number;
  gapMs?: number;
  partials?: Array<{ frequency: number; gain: number }>;
  type?: OscillatorType;
}

export interface ToneOption<TToneId extends string> {
  description: string;
  id: TToneId;
  label: string;
}

export const FEEDBACK_TONES: Record<FeedbackToneId, TonePattern> = {
  "acceptable-a": {
    durationMs: 240,
    frequency: 880,
    gain: 0.95,
    type: "triangle",
  },
  "acceptable-b": {
    durationMs: 260,
    frequency: 740,
    gain: 0.95,
    type: "triangle",
  },
  "outside-a": {
    durationMs: 320,
    frequency: 440,
    gain: 1,
    type: "triangle",
  },
  "outside-b": {
    durationMs: 340,
    frequency: 360,
    gain: 1,
    type: "triangle",
  },
};

export const USER_TONES: Record<UserToneId, TonePattern> = {
  marker: {
    durationMs: 220,
    frequency: 620,
    gain: 0.9,
    type: "triangle",
  },
  confirm: {
    durationMs: 240,
    frequency: 520,
    gain: 0.9,
    type: "triangle",
  },
};

export const ACCEPTABLE_TONE_OPTIONS: ToneOption<"acceptable-a" | "acceptable-b">[] = [
  {
    id: "acceptable-a",
    label: "Medium clear tone",
    description: "Clear mid-range cue for timing that is close to the target.",
  },
  {
    id: "acceptable-b",
    label: "Higher clear tone",
    description: "Clear higher mid-range cue for timing that is close to the target.",
  },
];

export const OUTSIDE_TONE_OPTIONS: ToneOption<"outside-a" | "outside-b">[] = [
  {
    id: "outside-a",
    label: "Lower steady tone",
    description: "Clear lower cue for timing that needs adjustment.",
  },
  {
    id: "outside-b",
    label: "Deep steady tone",
    description: "Clear deeper cue for timing that needs adjustment.",
  },
];

export const USER_TONE_OPTIONS: ToneOption<UserToneId>[] = [
  {
    id: "marker",
    label: "Marker tone",
    description: "Clear mid-range cue used for your replay points.",
  },
  {
    id: "confirm",
    label: "Confirm tone",
    description: "Clear lower cue used as an alternate replay point sound.",
  },
];
