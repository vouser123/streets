// app/practice/PracticePage.tsx - Client practice host for the primary timing flow.

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "@/app/practice/PracticePage.module.css";
import { CueBanner } from "@/components/CueBanner";
import { PracticeProgress } from "@/components/PracticeProgress";
import { PrimaryPracticeButton } from "@/components/PrimaryPracticeButton";
import { RouteFrame } from "@/components/RouteFrame";
import { VisualCuePanel } from "@/components/VisualCuePanel";
import { useCuePlayback } from "@/hooks/useCuePlayback";
import { usePracticeAnnouncements } from "@/hooks/usePracticeAnnouncements";
import { usePracticePersistence } from "@/hooks/usePracticePersistence";
import { usePracticeSession } from "@/hooks/usePracticeSession";
import { useScreenReaderRouteFocus } from "@/hooks/useScreenReaderRouteFocus";
import { getModeTitle } from "@/lib/practice-modes";
import { buildReplayPlan } from "@/lib/practice-replay";
import { hasRequiredTiming } from "@/lib/practice-timing";
import type { PracticeMode } from "@/lib/types";

export function PracticePage() {
  const titleRef = useScreenReaderRouteFocus<HTMLHeadingElement>();
  const { hydrated, state, setLastMode } = usePracticePersistence();
  const { announce, ensureSpeechReady, liveMessage } = usePracticeAnnouncements();
  const { emitVisualCue, playReplayEvent, vibrate, warmAudio } = useCuePlayback();
  const [cueMessage, setCueMessage] = useState(
    "The large button starts practice and marks your next point.",
  );
  const [visualLabel, setVisualLabel] = useState("Ready");
  const [visualKind, setVisualKind] = useState<"user" | "acceptable" | "outside" | null>(null);
  const mode = state.lastMode;

  const readyForPractice = hasRequiredTiming(state.timing);

  const session = usePracticeSession({
    mode,
    timing: state.timing,
    calibration: state.calibration,
    onNeedTiming: (message) => {
      setCueMessage(message);
      void announce(message, state.calibration.announceCues);
    },
    onReplayEvent: (kind, label, delayMs) => {
      if (state.calibration.outputMode !== "audio-only") {
        emitVisualCue(
          kind,
          label,
          state.calibration,
          (value) => {
            setVisualKind(value?.kind ?? null);
            setVisualLabel(value?.label ?? "Ready");
          },
          delayMs,
        );
      }
      if (kind === "user" && state.calibration.flashAction) {
        window.setTimeout(() => {
          vibrate(state.calibration.vibrate);
        }, delayMs);
      }
    },
    onReplayAudio: (activeMode, markerTimes) => {
      const replayPlan = buildReplayPlan(activeMode, markerTimes, state.timing);
      replayPlan.userEvents.forEach((event) => void playReplayEvent(event, state.calibration));
      replayPlan.referenceEvents.forEach((event) => void playReplayEvent(event, state.calibration));
    },
    onAnnounce: (message) => {
      setCueMessage(message);
      void announce(message, state.calibration.announceCues);
    },
  });

  const modeOptions = useMemo(
    () =>
      (["2b", "2", "3"] as PracticeMode[]).map((value) => ({
        value,
        title: getModeTitle(value),
      })),
    [],
  );

  const handleAction = async () => {
    await warmAudio();
    await ensureSpeechReady({ warmOnly: true });
    session.pressAction();
  };

  return (
    <RouteFrame
      intro="Start an attempt, mark your crossing points, then compare your timing with the reference."
      preferences={state.preferences}
      title="Practice"
      titleRef={titleRef}
    >
      <div aria-live="polite" className={styles.screenReaderOnly}>
        {liveMessage}
      </div>
      <section className={styles.stack}>
        <div className={styles.panel}>
          <fieldset className={styles.modeGroup}>
            <legend className={styles.sectionTitle}>Practice mode</legend>
            {modeOptions.map((option) => (
              <label key={option.value} className={styles.modeCard}>
                <input
                  aria-label={option.title}
                  checked={mode === option.value}
                  name="mode"
                  onChange={() => setLastMode(option.value)}
                  type="radio"
                  value={option.value}
                />
                <span aria-hidden="true" className={styles.modeTitle}>
                  {option.title}
                </span>
              </label>
            ))}
          </fieldset>
          {!readyForPractice ? (
            <div className={styles.notice}>
              <p>Timing setup is required before practice can start.</p>
              <Link className={styles.inlineLink} href="/timing">
                Go to Timing Setup
              </Link>
            </div>
          ) : null}
          <PrimaryPracticeButton
            disabled={!hydrated || session.isReplaying}
            label={session.actionLabel}
            onPress={handleAction}
          />
          <p className={styles.status}>{session.status}</p>
          <button className={styles.resetButton} onClick={session.reset} type="button">
            Reset current attempt
          </button>
        </div>

        <div className={styles.panel}>
          {state.calibration.showBanner ? (
            <CueBanner activeKind={visualKind} message={cueMessage} />
          ) : null}
          <VisualCuePanel
            activeKind={visualKind}
            label={visualLabel}
            outsideVisualVariant={state.calibration.outsideVisualVariant}
            userFlashContrast={state.calibration.userFlashContrast}
          />
        </div>

        <div className={styles.panel}>
          <h2 className={styles.sectionTitle}>Progress</h2>
          <PracticeProgress
            currentStage={session.currentStage}
            labels={session.labels}
            started={session.started}
          />
        </div>

        <div className={styles.panel}>
          <h2 className={styles.sectionTitle}>Replay Summary</h2>
          {session.replaySummary.length === 0 ? (
            <p>Replay results appear here after each attempt.</p>
          ) : (
            <ul className={styles.summaryList}>
              {session.replaySummary.map((result) => (
                <li key={result.label} className={styles.summaryItem}>
                  <strong>{result.label}</strong>
                  <span>
                    You: {result.userTime?.toFixed(2) ?? "missed"} sec | Ref:{" "}
                    {result.referenceTime.toFixed(2)} sec
                  </span>
                  <span>{result.withinTolerance ? "On target" : "Needs adjustment"}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </RouteFrame>
  );
}
