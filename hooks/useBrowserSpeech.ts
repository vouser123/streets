// hooks/useBrowserSpeech.ts — Speech synthesis readiness and queue helpers.

"use client";

import { useCallback, useRef } from "react";

export function useBrowserSpeech() {
  const speechWarmPromiseRef = useRef<Promise<SpeechSynthesis | null> | null>(null);
  const speechWarmedRef = useRef(false);

  const ensureSpeechReady = useCallback(
    async ({ warmOnly = false }: { warmOnly?: boolean } = {}) => {
      try {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
          return null;
        }

        const synth = window.speechSynthesis;
        synth.resume?.();

        if (speechWarmedRef.current) {
          return synth;
        }

        const voices = synth.getVoices();
        if (voices.length > 0 && !warmOnly) {
          speechWarmedRef.current = true;
          return synth;
        }

        if (!speechWarmPromiseRef.current) {
          speechWarmPromiseRef.current = new Promise<SpeechSynthesis | null>((resolve) => {
            let settled = false;

            const settle = () => {
              if (settled) {
                return;
              }
              settled = true;
              synth.removeEventListener?.("voiceschanged", handleVoicesChanged);
              resolve(synth);
            };

            const handleVoicesChanged = () => {
              if (synth.getVoices().length > 0) {
                speechWarmedRef.current = true;
              }
              settle();
            };

            synth.addEventListener?.("voiceschanged", handleVoicesChanged);

            if (warmOnly && !speechWarmedRef.current) {
              try {
                const warmUtterance = new SpeechSynthesisUtterance(".");
                warmUtterance.volume = 0;
                warmUtterance.rate = 10;
                warmUtterance.onend = () => {
                  speechWarmedRef.current = true;
                  settle();
                };
                warmUtterance.onerror = settle;
                synth.cancel();
                synth.speak(warmUtterance);
              } catch {
                settle();
              }
            }

            window.setTimeout(
              () => {
                if (!speechWarmedRef.current && synth.getVoices().length > 0) {
                  speechWarmedRef.current = true;
                }
                settle();
              },
              warmOnly ? 300 : 800,
            );
          }).finally(() => {
            speechWarmPromiseRef.current = null;
          });
        }

        await speechWarmPromiseRef.current;
        return synth;
      } catch {
        speechWarmPromiseRef.current = null;
        return null;
      }
    },
    [],
  );

  const speakText = useCallback(
    async (text: string) => {
      if (!text) {
        return;
      }
      try {
        const synth = await ensureSpeechReady();
        if (!synth) {
          return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        synth.speak(utterance);
      } catch {
        // Speech is best-effort only.
      }
    },
    [ensureSpeechReady],
  );

  const clearSpeechQueue = useCallback(() => {
    try {
      window.speechSynthesis?.cancel();
    } catch {
      // Speech is best-effort only.
    }
  }, []);

  return {
    ensureSpeechReady,
    speakText,
    clearSpeechQueue,
  };
}
