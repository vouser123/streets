// hooks/usePracticePersistence.ts — Local persisted Streets state hydration and updates.

"use client";

import { useEffect, useState } from "react";
import { DEFAULT_APP_STATE } from "@/lib/practice-defaults";
import { loadPersistedAppState, savePersistedAppState } from "@/lib/practice-storage";
import type {
  CalibrationSettings,
  PersistedAppState,
  PracticeMode,
  Preferences,
  TimingSettings,
} from "@/lib/types";

export function usePracticePersistence() {
  const [state, setState] = useState<PersistedAppState>(DEFAULT_APP_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadPersistedAppState();
    setState(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    savePersistedAppState(state);
  }, [hydrated, state]);

  const setTiming = (timing: TimingSettings) => {
    setState((current) => {
      const next = { ...current, timing };
      if (hydrated) {
        savePersistedAppState(next);
      }
      return next;
    });
  };

  const setCalibration = (calibration: CalibrationSettings) => {
    setState((current) => {
      const next = { ...current, calibration };
      if (hydrated) {
        savePersistedAppState(next);
      }
      return next;
    });
  };

  const setPreferences = (preferences: Preferences) => {
    setState((current) => {
      const next = { ...current, preferences };
      if (hydrated) {
        savePersistedAppState(next);
      }
      return next;
    });
  };

  const setLastMode = (lastMode: PracticeMode) => {
    setState((current) => {
      const next = { ...current, lastMode };
      if (hydrated) {
        savePersistedAppState(next);
      }
      return next;
    });
  };

  return {
    hydrated,
    state,
    setTiming,
    setCalibration,
    setPreferences,
    setLastMode,
  };
}
