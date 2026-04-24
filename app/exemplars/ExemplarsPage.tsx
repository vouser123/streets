// app/exemplars/ExemplarsPage.tsx - Client exemplar host for guided reference playback.

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "@/app/exemplars/ExemplarsPage.module.css";
import { CueBanner } from "@/components/CueBanner";
import { RouteFrame } from "@/components/RouteFrame";
import { VisualCuePanel } from "@/components/VisualCuePanel";
import { useCuePlayback } from "@/hooks/useCuePlayback";
import { usePracticePersistence } from "@/hooks/usePracticePersistence";
import { useScreenReaderRouteFocus } from "@/hooks/useScreenReaderRouteFocus";
import { getModeLabels, getModeTitle } from "@/lib/practice-modes";
import { getReferenceTimesForMode, hasRequiredTiming } from "@/lib/practice-timing";
import type { PracticeMode, ReplayEvent } from "@/lib/types";

export function ExemplarsPage() {
  const titleRef = useScreenReaderRouteFocus<HTMLHeadingElement>();
  const { state } = usePracticePersistence();
  const { cancelPlayback, emitVisualCue, playReplayEvent, warmAudio } = useCuePlayback();
  const exemplarCleanupRef = useRef<Set<() => void>>(new Set());
  const exemplarRunIdRef = useRef(0);
  const [message, setMessage] = useState(
    "Use an exemplar to hear and see the reference timing without marking your own cues.",
  );
  const [visualKind, setVisualKind] = useState<"user" | "acceptable" | "outside" | null>(null);
  const [visualLabel, setVisualLabel] = useState("Ready");
  const ready = hasRequiredTiming(state.timing);

  const stopExemplarPlayback = () => {
    exemplarRunIdRef.current += 1;
    cancelPlayback();
    exemplarCleanupRef.current.forEach((cancel) => {
      cancel();
    });
    exemplarCleanupRef.current.clear();
    setVisualKind(null);
    setVisualLabel("Ready");
  };

  useEffect(
    () => () => {
      exemplarRunIdRef.current += 1;
      cancelPlayback();
      exemplarCleanupRef.current.forEach((cancel) => {
        cancel();
      });
      exemplarCleanupRef.current.clear();
    },
    [cancelPlayback],
  );

  const playExemplar = async (mode: PracticeMode) => {
    stopExemplarPlayback();
    const runId = exemplarRunIdRef.current;
    if (!ready) {
      setMessage("Enter both street times before playing exemplars.");
      return;
    }

    await warmAudio();
    if (runId !== exemplarRunIdRef.current) {
      return;
    }
    const labels = getModeLabels(mode);
    const events = getReferenceTimesForMode(mode, state.timing).map<ReplayEvent>(
      (timeSec, index) => ({
        label: labels[index],
        timeSec: 0.5 + timeSec,
        type: "user",
      }),
    );

    setMessage(`Playing exemplar: ${labels.join(" to ")}.`);
    events.forEach((event) => {
      void playReplayEvent(event, state.calibration).then((cancelTone) => {
        if (!cancelTone) {
          return;
        }
        if (runId !== exemplarRunIdRef.current) {
          cancelTone();
          return;
        }
        exemplarCleanupRef.current.add(cancelTone);
      });
      if (state.calibration.outputMode !== "audio-only") {
        const cancelVisual = emitVisualCue(
          "user",
          event.label ?? "Reference point",
          state.calibration,
          (value) => {
            setVisualKind(value?.kind ?? null);
            setVisualLabel(value?.label ?? "Ready");
          },
          event.timeSec * 1000,
        );
        exemplarCleanupRef.current.add(cancelVisual);
      }
    });
  };

  return (
    <RouteFrame
      intro="Play the reference timing sequence for each practice route."
      preferences={state.preferences}
      title="Exemplars"
      titleRef={titleRef}
    >
      {!ready ? (
        <section className={styles.panel}>
          <p>Set your street times first so exemplar playback matches your actual timing values.</p>
          <Link className={styles.inlineLink} href="/timing">
            Go to Timing Setup
          </Link>
        </section>
      ) : null}
      <section className={styles.panel}>
        <div className={styles.buttonGrid}>
          {(["2", "2b", "3"] as PracticeMode[]).map((mode) => (
            <button
              key={mode}
              className={styles.exemplarButton}
              disabled={!ready}
              onClick={() => void playExemplar(mode)}
              type="button"
            >
              Play {getModeTitle(mode)}
            </button>
          ))}
        </div>
      </section>
      <section className={styles.panel}>
        {state.calibration.showBanner ? (
          <CueBanner activeKind={visualKind} message={message} />
        ) : null}
        <VisualCuePanel
          activeKind={visualKind}
          label={visualLabel}
          outsideVisualVariant={state.calibration.outsideVisualVariant}
          userFlashContrast={state.calibration.userFlashContrast}
        />
      </section>
    </RouteFrame>
  );
}
