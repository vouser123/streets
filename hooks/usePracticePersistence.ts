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
    setState((current) => ({ ...current, timing }));
  };

  const setCalibration = (calibration: CalibrationSettings) => {
    setState((current) => ({ ...current, calibration }));
  };

  const setPreferences = (preferences: Preferences) => {
    setState((current) => ({ ...current, preferences }));
  };

  const setLastMode = (lastMode: PracticeMode) => {
    setState((current) => ({ ...current, lastMode }));
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
