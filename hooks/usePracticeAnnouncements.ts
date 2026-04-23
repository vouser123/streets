// hooks/usePracticeAnnouncements.ts — Live-region and optional speech announcements.

"use client";

import { useCallback, useState } from "react";
import { useBrowserSpeech } from "@/hooks/useBrowserSpeech";

export function usePracticeAnnouncements() {
  const [liveMessage, setLiveMessage] = useState("");
  const { speakText, ensureSpeechReady } = useBrowserSpeech();

  const announce = useCallback(
    async (message: string, speak = false) => {
      setLiveMessage(message);
      if (speak) {
        await speakText(message);
      }
    },
    [speakText],
  );

  return {
    liveMessage,
    announce,
    ensureSpeechReady,
  };
}
