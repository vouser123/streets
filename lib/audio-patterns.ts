// lib/audio-patterns.ts — Simple browser-native tone definitions for Streets cues.

import type { FeedbackToneId, UserToneId } from "@/lib/types";

export interface TonePattern {
  frequency: number;
  durationMs: number;
  gain: number;
  type?: OscillatorType;
}

export interface ToneOption<TToneId extends string> {
  description: string;
  id: TToneId;
  label: string;
}

export const FEEDBACK_TONES: Record<FeedbackToneId, TonePattern> = {
  "acceptable-a": { frequency: 660, durationMs: 220, gain: 0.18, type: "sine" },
  "acceptable-b": { frequency: 780, durationMs: 180, gain: 0.16, type: "triangle" },
  "outside-a": { frequency: 240, durationMs: 280, gain: 0.2, type: "square" },
  "outside-b": { frequency: 180, durationMs: 320, gain: 0.22, type: "sawtooth" },
};

export const USER_TONES: Record<UserToneId, TonePattern> = {
  marker: { frequency: 410, durationMs: 160, gain: 0.16, type: "square" },
  confirm: { frequency: 350, durationMs: 140, gain: 0.15, type: "triangle" },
};

export const ACCEPTABLE_TONE_OPTIONS: ToneOption<"acceptable-a" | "acceptable-b">[] = [
  {
    id: "acceptable-a",
    label: "Bright chime",
    description: "Short higher chime for reference points that land within tolerance.",
  },
  {
    id: "acceptable-b",
    label: "Soft bell",
    description: "Rounder, lighter bell sound for within-tolerance feedback.",
  },
];

export const OUTSIDE_TONE_OPTIONS: ToneOption<"outside-a" | "outside-b">[] = [
  {
    id: "outside-a",
    label: "Low buzz",
    description: "Short lower buzz for reference points outside tolerance.",
  },
  {
    id: "outside-b",
    label: "Deep alert",
    description: "Longer rough alert tone for outside-tolerance feedback.",
  },
];

export const USER_TONE_OPTIONS: ToneOption<UserToneId>[] = [
  {
    id: "marker",
    label: "Marker click",
    description: "Square cue used for the user replay markers.",
  },
  {
    id: "confirm",
    label: "Confirm chime",
    description: "Softer chime used as the user replay marker.",
  },
];
