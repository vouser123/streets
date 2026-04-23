// hooks/useBrowserAudioContext.ts — Web Audio readiness and tone playback helpers.

"use client";

import { useCallback, useRef } from "react";
import type { TonePattern } from "@/lib/audio-patterns";

type BrowserAudioContext = AudioContext & { outputLatency?: number };

export function useBrowserAudioContext() {
  const audioContextRef = useRef<BrowserAudioContext | null>(null);
  const audioResumePromiseRef = useRef<Promise<null> | null>(null);

  const ensureAudioReady = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        const Ctx =
          window.AudioContext ||
          (window as typeof window & { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (Ctx) {
          audioContextRef.current = new Ctx() as BrowserAudioContext;
        }
      }

      const context = audioContextRef.current;
      if (!context) {
        return null;
      }

      if (context.state === "suspended") {
        if (!audioResumePromiseRef.current) {
          audioResumePromiseRef.current = Promise.race([
            Promise.resolve(context.resume()).then(() => null),
            new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 1000)),
          ]).finally(() => {
            audioResumePromiseRef.current = null;
          });
        }

        await audioResumePromiseRef.current;
      }

      return context;
    } catch {
      audioContextRef.current = null;
      audioResumePromiseRef.current = null;
      return null;
    }
  }, []);

  const playTone = useCallback(
    async (pattern: TonePattern, startDelaySec = 0) => {
      try {
        const context = await ensureAudioReady();
        if (!context || context.state !== "running") {
          return;
        }

        const startTime = context.currentTime + startDelaySec;
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        oscillator.frequency.value = pattern.frequency;
        oscillator.type = pattern.type ?? "sine";

        const endTime = startTime + pattern.durationMs / 1000;
        gainNode.gain.setValueAtTime(Math.max(0.0001, pattern.gain), startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);
        oscillator.start(startTime);
        oscillator.stop(endTime);
      } catch {
        // Audio is best-effort only.
      }
    },
    [ensureAudioReady],
  );

  return {
    ensureAudioReady,
    playTone,
  };
}
