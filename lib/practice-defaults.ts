// lib/practice-defaults.ts — Default persisted settings for the Streets rebuild.

import type { PersistedAppState } from "@/lib/types";

export const DEFAULT_APP_STATE: PersistedAppState = {
  version: 1,
  lastMode: "2",
  timing: {
    clearTime: null,
    fullTime: null,
    tolerance: 0.5,
  },
  calibration: {
    acceptableToneId: "acceptable-a",
    outsideToneId: "outside-a",
    userToneId: "marker",
    outputMode: "audio-only",
    showBanner: true,
    flashAction: false,
    vibrate: false,
    syncVisualReplay: true,
    outsideVisualVariant: "up",
    userFlashContrast: "soft",
    announceCues: true,
  },
  preferences: {
    theme: "system",
    textSize: "default",
    highContrast: false,
    focusBoost: false,
    useTextLabels: true,
    reducedMotion: false,
  },
};

export const APP_STATE_STORAGE_KEY = "om-app-state";
