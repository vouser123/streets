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

        const startTime = context.currentTime + Math.max(0, startDelaySec);
        const gainNode = context.createGain();
        gainNode.connect(context.destination);

        const endTime = startTime + pattern.durationMs / 1000;
        gainNode.gain.setValueAtTime(0.0001, startTime);
        gainNode.gain.linearRampToValueAtTime(Math.max(0.0001, pattern.gain), startTime + 0.012);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);
        const partials = pattern.partials ?? [{ frequency: pattern.frequency ?? 440, gain: 1 }];

        partials.forEach((partial) => {
          const oscillator = context.createOscillator();
          const partialGain = context.createGain();
          oscillator.connect(partialGain).connect(gainNode);
          oscillator.frequency.value = partial.frequency;
          oscillator.type = pattern.type ?? "sine";
          partialGain.gain.setValueAtTime(partial.gain, startTime);
          oscillator.start(startTime);
          oscillator.stop(endTime + 0.02);
        });
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
