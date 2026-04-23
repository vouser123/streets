// lib/practice-storage.ts — Versioned localStorage load and save helpers for Streets.

import { APP_STATE_STORAGE_KEY, DEFAULT_APP_STATE } from "@/lib/practice-defaults";
import type {
  CalibrationSettings,
  PersistedAppState,
  Preferences,
  TimingSettings,
} from "@/lib/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function mergeTiming(value: unknown): TimingSettings {
  if (!isRecord(value)) {
    return DEFAULT_APP_STATE.timing;
  }
  return {
    clearTime:
      typeof value.clearTime === "number" && Number.isFinite(value.clearTime)
        ? value.clearTime
        : null,
    fullTime:
      typeof value.fullTime === "number" && Number.isFinite(value.fullTime) ? value.fullTime : null,
    tolerance:
      typeof value.tolerance === "number" && Number.isFinite(value.tolerance)
        ? Math.max(0, value.tolerance)
        : DEFAULT_APP_STATE.timing.tolerance,
  };
}

function mergeCalibration(value: unknown): CalibrationSettings {
  if (!isRecord(value)) {
    return DEFAULT_APP_STATE.calibration;
  }
  return {
    ...DEFAULT_APP_STATE.calibration,
    ...value,
  } as CalibrationSettings;
}

function mergePreferences(value: unknown): Preferences {
  if (!isRecord(value)) {
    return DEFAULT_APP_STATE.preferences;
  }
  return {
    ...DEFAULT_APP_STATE.preferences,
    ...value,
  } as Preferences;
}

export function loadPersistedAppState(): PersistedAppState {
  if (typeof window === "undefined") {
    return DEFAULT_APP_STATE;
  }

  try {
    const raw = window.localStorage.getItem(APP_STATE_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_APP_STATE;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) {
      return DEFAULT_APP_STATE;
    }

    return {
      version: 1,
      lastMode: parsed.lastMode === "2b" || parsed.lastMode === "3" ? parsed.lastMode : "2",
      timing: mergeTiming(parsed.timing),
      calibration: mergeCalibration(parsed.calibration),
      preferences: mergePreferences(parsed.preferences),
    };
  } catch {
    return DEFAULT_APP_STATE;
  }
}

export function savePersistedAppState(state: PersistedAppState): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(state));
}
