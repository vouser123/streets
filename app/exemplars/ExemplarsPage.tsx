// app/exemplars/ExemplarsPage.tsx - Client exemplar host for guided reference playback.

"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "@/app/exemplars/ExemplarsPage.module.css";
import { CueBanner } from "@/components/CueBanner";
import { RouteFrame } from "@/components/RouteFrame";
import { VisualCuePanel } from "@/components/VisualCuePanel";
import { useCuePlayback } from "@/hooks/useCuePlayback";
import { usePracticePersistence } from "@/hooks/usePracticePersistence";
import { useScreenReaderRouteFocus } from "@/hooks/useScreenReaderRouteFocus";
import { getModeTitle } from "@/lib/practice-modes";
import { buildReplayPlan } from "@/lib/practice-replay";
import { getReferenceTimesForMode, hasRequiredTiming } from "@/lib/practice-timing";
import type { PracticeMode } from "@/lib/types";

export function ExemplarsPage() {
  const titleRef = useScreenReaderRouteFocus<HTMLHeadingElement>();
  const { state } = usePracticePersistence();
  const { emitVisualCue, playReplayEvent } = useCuePlayback();
  const [message, setMessage] = useState(
    "Use an exemplar to hear and see the reference timing without marking your own cues.",
  );
  const [visualKind, setVisualKind] = useState<"user" | "acceptable" | "outside" | null>(null);
  const [visualLabel, setVisualLabel] = useState("Ready");
  const ready = hasRequiredTiming(state.timing);

  const playExemplar = (mode: PracticeMode) => {
    const referenceTimes = getReferenceTimesForMode(mode, state.timing);
    const reference = buildReplayPlan(mode, referenceTimes, state.timing, 0.5, 0.9);
    setMessage(`${getModeTitle(mode)} exemplar started.`);
    reference.referenceEvents.forEach((event) => {
      void playReplayEvent(event, state.calibration);
      if (state.calibration.outputMode !== "audio-only") {
        emitVisualCue(
          event.feedbackType === "outside" ? "outside" : "acceptable",
          event.label ?? "Reference cue",
          state.calibration,
          (value) => {
            setVisualKind(value?.kind ?? null);
            setVisualLabel(value?.label ?? "Ready");
          },
          event.timeSec * 1000,
        );
      }
    });
  };

  return (
    <RouteFrame
      intro="Exemplars are separated from calibration so you can reach and repeat the reference timing without mixing in setup controls."
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
              onClick={() => playExemplar(mode)}
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
