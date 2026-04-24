// hooks/useBrowserAudioContext.ts — Web Audio readiness and tone playback helpers.

"use client";

import { useCallback, useRef } from "react";
import type { TonePattern } from "@/lib/audio-patterns";
import { type CancelScheduledTone, scheduleTone } from "@/lib/web-audio-tone";

type BrowserAudioContext = AudioContext & { outputLatency?: number };

export function useBrowserAudioContext() {
  const audioContextRef = useRef<BrowserAudioContext | null>(null);
  const audioResumePromiseRef = useRef<Promise<null> | null>(null);
  const scheduledToneStopsRef = useRef<Set<CancelScheduledTone>>(new Set());

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
          return null;
        }

        const cancelScheduledTone = scheduleTone(context, pattern, startDelaySec);
        let cleanupTimeoutId: number | null = null;
        const cancelTone = () => {
          if (cleanupTimeoutId !== null) {
            window.clearTimeout(cleanupTimeoutId);
          }
          cancelScheduledTone();
          scheduledToneStopsRef.current.delete(cancelTone);
        };
        scheduledToneStopsRef.current.add(cancelTone);
        cleanupTimeoutId = window.setTimeout(
          () => {
            scheduledToneStopsRef.current.delete(cancelTone);
          },
          (Math.max(0.01, startDelaySec) + pattern.durationMs / 1000 + 0.2) * 1000,
        );
        return cancelTone;
      } catch {
        // Audio is best-effort only.
      }
      return null;
    },
    [ensureAudioReady],
  );

  const cancelScheduledTones = useCallback(() => {
    scheduledToneStopsRef.current.forEach((cancelTone) => {
      cancelTone();
    });
    scheduledToneStopsRef.current.clear();
  }, []);

  return {
    cancelScheduledTones,
    ensureAudioReady,
    playTone,
  };
}
