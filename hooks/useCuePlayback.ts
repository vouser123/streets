// hooks/useCuePlayback.ts — Browser cue playback for previews, replay, and cue feedback.

"use client";

import { useCallback } from "react";
import { useBrowserAudioContext } from "@/hooks/useBrowserAudioContext";
import { FEEDBACK_TONES, USER_TONES } from "@/lib/audio-patterns";
import type {
  CalibrationSettings,
  ReplayEvent,
  UserFlashContrast,
  VisualVariant,
} from "@/lib/types";

export interface VisualCueState {
  active: boolean;
  kind: "user" | "acceptable" | "outside";
  label: string;
  outsideVisualVariant: VisualVariant;
  userFlashContrast: UserFlashContrast;
}

const VISUAL_RESET_DELAY_MS = 200;

export function useCuePlayback() {
  const { cancelScheduledTones, ensureAudioReady, playTone } = useBrowserAudioContext();

  const warmAudio = useCallback(async () => {
    await ensureAudioReady();
  }, [ensureAudioReady]);

  const playFeedbackPreview = useCallback(
    async (toneId: keyof typeof FEEDBACK_TONES) => {
      await playTone(FEEDBACK_TONES[toneId]);
    },
    [playTone],
  );

  const playUserPreview = useCallback(
    async (toneId: keyof typeof USER_TONES) => {
      await playTone(USER_TONES[toneId]);
    },
    [playTone],
  );

  const vibrate = useCallback((enabled: boolean) => {
    if (enabled) {
      window.navigator.vibrate?.(60);
    }
  }, []);

  const playReplayEvent = useCallback(
    async (event: ReplayEvent, settings: CalibrationSettings) => {
      if (settings.outputMode === "visual-only") {
        return null;
      }
      if (event.type === "user") {
        return playTone(USER_TONES[settings.userToneId], event.timeSec);
      }
      const toneId =
        event.feedbackType === "outside" ? settings.outsideToneId : settings.acceptableToneId;
      return playTone(FEEDBACK_TONES[toneId], event.timeSec);
    },
    [playTone],
  );

  const emitVisualCue = useCallback(
    (
      kind: VisualCueState["kind"],
      label: string,
      settings: CalibrationSettings,
      setVisualCue: (value: VisualCueState | null) => void,
      delayMs = 0,
    ) => {
      let resetTimeoutId: number | null = null;
      const startTimeoutId = window.setTimeout(() => {
        setVisualCue({
          active: true,
          kind,
          label,
          outsideVisualVariant: settings.outsideVisualVariant,
          userFlashContrast: settings.userFlashContrast,
        });
        resetTimeoutId = window.setTimeout(() => setVisualCue(null), VISUAL_RESET_DELAY_MS);
      }, delayMs);
      return () => {
        window.clearTimeout(startTimeoutId);
        if (resetTimeoutId !== null) {
          window.clearTimeout(resetTimeoutId);
        }
      };
    },
    [],
  );

  return {
    cancelPlayback: cancelScheduledTones,
    warmAudio,
    playFeedbackPreview,
    playUserPreview,
    playReplayEvent,
    emitVisualCue,
    vibrate,
  };
}
