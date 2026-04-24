// lib/audio-patterns.ts — Simple browser-native tone definitions for Streets cues.

import type { FeedbackToneId, UserToneId } from "@/lib/types";

export interface TonePattern {
  frequency?: number;
  durationMs: number;
  gain: number;
  partials?: Array<{ frequency: number; gain: number }>;
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
    durationMs: 300,
    gain: 0.95,
    segments: [
      {
        durationMs: 95,
        gapMs: 45,
        partials: [
          { frequency: 1040, gain: 1 },
          { frequency: 2080, gain: 0.22 },
        ],
      },
      {
        durationMs: 160,
        partials: [
          { frequency: 1560, gain: 1 },
          { frequency: 2340, gain: 0.18 },
        ],
      },
    ],
    type: "triangle",
  },
  "acceptable-b": {
    durationMs: 260,
    gain: 0.92,
    partials: [
      { frequency: 920, gain: 1 },
      { frequency: 1840, gain: 0.24 },
    ],
    type: "triangle",
  },
  "outside-a": {
    durationMs: 290,
    gain: 0.98,
    segments: [
      {
        durationMs: 110,
        gapMs: 70,
        partials: [
          { frequency: 680, gain: 1 },
          { frequency: 1360, gain: 0.32 },
        ],
      },
      {
        durationMs: 110,
        partials: [
          { frequency: 680, gain: 1 },
          { frequency: 1360, gain: 0.32 },
        ],
      },
    ],
    type: "triangle",
  },
  "outside-b": {
    durationMs: 300,
    gain: 0.98,
    segments: [
      {
        durationMs: 125,
        gapMs: 55,
        partials: [
          { frequency: 780, gain: 1 },
          { frequency: 1560, gain: 0.28 },
        ],
      },
      {
        durationMs: 120,
        partials: [
          { frequency: 540, gain: 1 },
          { frequency: 1080, gain: 0.34 },
        ],
      },
    ],
    type: "triangle",
  },
};

export const USER_TONES: Record<UserToneId, TonePattern> = {
  marker: {
    durationMs: 230,
    gain: 0.95,
    partials: [
      { frequency: 1180, gain: 1 },
      { frequency: 2360, gain: 0.2 },
    ],
    type: "triangle",
  },
  confirm: {
    durationMs: 260,
    gain: 0.93,
    segments: [
      {
        durationMs: 95,
        gapMs: 35,
        partials: [
          { frequency: 980, gain: 1 },
          { frequency: 1960, gain: 0.18 },
        ],
      },
      {
        durationMs: 130,
        partials: [
          { frequency: 1320, gain: 1 },
          { frequency: 2640, gain: 0.16 },
        ],
      },
    ],
    type: "triangle",
  },
};

export const ACCEPTABLE_TONE_OPTIONS: ToneOption<"acceptable-a" | "acceptable-b">[] = [
  {
    id: "acceptable-a",
    label: "Bright double beep",
    description: "Stronger two-beep cue for timing that is close to the target.",
  },
  {
    id: "acceptable-b",
    label: "Steady bright beep",
    description: "Single stronger cue for timing that is close to the target.",
  },
];

export const OUTSIDE_TONE_OPTIONS: ToneOption<"outside-a" | "outside-b">[] = [
  {
    id: "outside-a",
    label: "Firm double pulse",
    description: "Distinct two-pulse cue for timing that needs adjustment.",
  },
  {
    id: "outside-b",
    label: "Falling double pulse",
    description: "Distinct falling cue for timing that needs adjustment.",
  },
];

export const USER_TONE_OPTIONS: ToneOption<UserToneId>[] = [
  {
    id: "marker",
    label: "Marker tone",
    description: "Strong cue used for your replay points.",
  },
  {
    id: "confirm",
    label: "Confirm tone",
    description: "Stronger two-note cue used as an alternate replay point sound.",
  },
];
