// lib/types.ts — Shared Streets app state and replay type contracts.

export type PracticeMode = "2" | "2b" | "3";

export type OutputMode = "audio-only" | "audio-visual" | "visual-only";

export type TextSize = "smaller" | "default" | "large" | "largest" | "huge" | "xl";

export type ThemePreference = "system" | "light" | "dark";

export type VisualVariant = "up" | "down" | "diamond";

export type UserFlashContrast = "soft" | "balanced" | "high";

export type FeedbackToneId = "acceptable-a" | "acceptable-b" | "outside-a" | "outside-b";

export type UserToneId = "marker" | "confirm";

export interface TimingSettings {
  clearTime: number | null;
  fullTime: number | null;
  tolerance: number;
}

export interface CalibrationSettings {
  acceptableToneId: Extract<FeedbackToneId, "acceptable-a" | "acceptable-b">;
  outsideToneId: Extract<FeedbackToneId, "outside-a" | "outside-b">;
  userToneId: UserToneId;
  outputMode: OutputMode;
  showBanner: boolean;
  flashAction: boolean;
  vibrate: boolean;
  syncVisualReplay: boolean;
  outsideVisualVariant: VisualVariant;
  userFlashContrast: UserFlashContrast;
  announceCues: boolean;
}

export interface Preferences {
  theme: ThemePreference;
  textSize: TextSize;
  highContrast: boolean;
  focusBoost: boolean;
  useTextLabels: boolean;
  reducedMotion: boolean;
}

export interface PersistedAppState {
  version: 1;
  lastMode: PracticeMode;
  timing: TimingSettings;
  calibration: CalibrationSettings;
  preferences: Preferences;
}

export interface ReplayStageResult {
  label: string;
  userTime: number | null;
  referenceTime: number;
  difference: number | null;
  withinTolerance: boolean;
}

export interface ReplayEvent {
  timeSec: number;
  type: "user" | "reference";
  feedbackType?: "acceptable" | "outside";
  label?: string;
}

export interface ReplayPlan {
  userEvents: ReplayEvent[];
  referenceEvents: ReplayEvent[];
  results: ReplayStageResult[];
  maxTimeSec: number;
}
