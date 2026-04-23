// hooks/usePracticeSession.ts — Practice-flow state machine and replay scheduling.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getNextActionLabel } from "@/lib/practice-labels";
import { getModeLabels } from "@/lib/practice-modes";
import { buildReplayPlan } from "@/lib/practice-replay";
import { getTimingRequirementMessage, hasRequiredTiming } from "@/lib/practice-timing";
import type {
  CalibrationSettings,
  PracticeMode,
  ReplayStageResult,
  TimingSettings,
} from "@/lib/types";

interface UsePracticeSessionOptions {
  mode: PracticeMode;
  timing: TimingSettings;
  calibration: CalibrationSettings;
  onNeedTiming: (message: string) => void;
  onReplayEvent: (kind: "user" | "acceptable" | "outside", label: string, delayMs: number) => void;
  onReplayAudio: (mode: PracticeMode, markerTimes: number[]) => void;
  onAnnounce: (message: string) => void;
}

export function usePracticeSession({
  mode,
  timing,
  onNeedTiming,
  onReplayEvent,
  onReplayAudio,
  onAnnounce,
}: UsePracticeSessionOptions) {
  const [started, setStarted] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [markerTimes, setMarkerTimes] = useState<number[]>([]);
  const [status, setStatus] = useState("Set your timing and begin.");
  const [replaySummary, setReplaySummary] = useState<ReplayStageResult[]>([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const timeoutIdsRef = useRef<number[]>([]);

  const labels = useMemo(() => getModeLabels(mode), [mode]);
  const currentStage = started ? markerTimes.length : 0;
  const actionLabel = isReplaying ? "Replaying" : getNextActionLabel(mode, currentStage);

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, []);

  const reset = () => {
    timeoutIdsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    timeoutIdsRef.current = [];
    setStarted(false);
    setStartTimestamp(null);
    setMarkerTimes([]);
    setIsReplaying(false);
    setStatus("Ready for another try.");
  };

  const pressAction = () => {
    if (isReplaying) {
      return;
    }

    if (!started) {
      const message = getTimingRequirementMessage(timing);
      if (!hasRequiredTiming(timing)) {
        onNeedTiming(message);
        setStatus(message);
        return;
      }
      setStarted(true);
      setStartTimestamp(performance.now());
      setMarkerTimes([0]);
      setReplaySummary([]);
      setStatus(`Practice started. ${getNextActionLabel(mode, 1)} when ready.`);
      onAnnounce(`Practice started. ${getNextActionLabel(mode, 1)} when ready.`);
      return;
    }

    if (startTimestamp === null) {
      return;
    }

    const elapsed = (performance.now() - startTimestamp) / 1000;
    const nextMarkerTimes = [...markerTimes, elapsed];
    setMarkerTimes(nextMarkerTimes);
    const nextIndex = nextMarkerTimes.length;

    if (nextIndex >= labels.length) {
      const replayPlan = buildReplayPlan(mode, nextMarkerTimes, timing);
      setReplaySummary(replayPlan.results);
      setStatus("Replaying your markers against the reference.");
      setIsReplaying(true);
      onAnnounce("Replaying your markers against the reference.");
      onReplayAudio(mode, nextMarkerTimes);

      replayPlan.userEvents.forEach((event) => {
        onReplayEvent("user", event.label ?? "Your marker", event.timeSec * 1000);
      });
      replayPlan.referenceEvents.forEach((event) => {
        onReplayEvent(
          event.feedbackType === "outside" ? "outside" : "acceptable",
          event.label ?? "Reference cue",
          event.timeSec * 1000,
        );
      });

      const timeoutId = window.setTimeout(() => {
        setIsReplaying(false);
        setStarted(false);
        setStartTimestamp(null);
        setMarkerTimes([]);
        setStatus("Replay finished. Ready for another try.");
        onAnnounce("Replay finished. Ready for another try.");
      }, replayPlan.maxTimeSec * 1000);
      timeoutIdsRef.current.push(timeoutId);
      return;
    }

    const nextAction = getNextActionLabel(mode, nextIndex);
    setStatus(`${labels[nextIndex]} marked. ${nextAction} when ready.`);
    onAnnounce(`${labels[nextIndex]} marked.`);
  };

  return {
    actionLabel,
    currentStage,
    isReplaying,
    markerTimes,
    replaySummary,
    started,
    status,
    labels,
    pressAction,
    reset,
  };
}
