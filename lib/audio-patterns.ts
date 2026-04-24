// lib/audio-patterns.ts — Simple browser-native tone definitions for Streets cues.

import type { FeedbackToneId, UserToneId } from "@/lib/types";

export interface TonePattern {
  frequency?: number;
  durationMs: number;
  gain: number;
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
    durationMs: 180,
    gain: 0.42,
    partials: [
      { frequency: 880, gain: 1 },
      { frequency: 1320, gain: 0.42 },
    ],
    type: "sine",
  },
  "acceptable-b": {
    durationMs: 210,
    gain: 0.42,
    partials: [
      { frequency: 740, gain: 1 },
      { frequency: 1110, gain: 0.38 },
    ],
    type: "triangle",
  },
  "outside-a": {
    durationMs: 240,
    gain: 0.48,
    partials: [
      { frequency: 260, gain: 1 },
      { frequency: 390, gain: 0.36 },
    ],
    type: "triangle",
  },
  "outside-b": {
    durationMs: 280,
    gain: 0.5,
    partials: [
      { frequency: 310, gain: 1 },
      { frequency: 465, gain: 0.34 },
    ],
    type: "sawtooth",
  },
};

export const USER_TONES: Record<UserToneId, TonePattern> = {
  marker: { frequency: 520, durationMs: 170, gain: 0.44, type: "triangle" },
  confirm: {
    durationMs: 190,
    gain: 0.42,
    partials: [
      { frequency: 420, gain: 1 },
      { frequency: 840, gain: 0.35 },
    ],
    type: "sine",
  },
};

export const ACCEPTABLE_TONE_OPTIONS: ToneOption<"acceptable-a" | "acceptable-b">[] = [
  {
    id: "acceptable-a",
    label: "Clear high chime",
    description: "Bright two-note cue for timing that is close to the target.",
  },
  {
    id: "acceptable-b",
    label: "Lower clear chime",
    description: "Lower two-note cue for timing that is close to the target.",
  },
];

export const OUTSIDE_TONE_OPTIONS: ToneOption<"outside-a" | "outside-b">[] = [
  {
    id: "outside-a",
    label: "Low pulse",
    description: "Strong lower cue for timing that needs adjustment.",
  },
  {
    id: "outside-b",
    label: "Deep pulse",
    description: "Longer lower cue for timing that needs adjustment.",
  },
];

export const USER_TONE_OPTIONS: ToneOption<UserToneId>[] = [
  {
    id: "marker",
    label: "Marker tone",
    description: "Clear cue used for your replay points.",
  },
  {
    id: "confirm",
    label: "Confirm tone",
    description: "Two-note cue used as an alternate replay point sound.",
  },
];
