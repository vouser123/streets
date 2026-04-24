// app/timing/TimingSetupPage.tsx - Client timing setup host for core street times.

"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/timing/TimingSetupPage.module.css";
import { RouteFrame } from "@/components/RouteFrame";
import { usePracticePersistence } from "@/hooks/usePracticePersistence";
import { useScreenReaderRouteFocus } from "@/hooks/useScreenReaderRouteFocus";
import { formatSeconds } from "@/lib/practice-labels";
import type { TimingSettings } from "@/lib/types";

const DECIMAL_ENTRY_PATTERN = /^\d*\.?\d*$/;
type DraftTiming = Record<keyof TimingSettings, string>;

function parseDecimalInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed === ".") {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatDraftValue(value: number | null): string {
  return value === null ? "" : String(value);
}

function parseDraftTiming(draft: DraftTiming): TimingSettings {
  return {
    clearTime: parseDecimalInput(draft.clearTime),
    fullTime: parseDecimalInput(draft.fullTime),
    tolerance: parseDecimalInput(draft.tolerance) ?? 0,
  };
}

export function TimingSetupPage() {
  const titleRef = useScreenReaderRouteFocus<HTMLHeadingElement>();
  const { hydrated, state, setTiming } = usePracticePersistence();
  const timing = state.timing;
  const syncedHydratedValuesRef = useRef(false);
  const [draftTiming, setDraftTiming] = useState<DraftTiming>({
    clearTime: formatDraftValue(timing.clearTime),
    fullTime: formatDraftValue(timing.fullTime),
    tolerance: String(timing.tolerance),
  });
  const draftTimingRef = useRef(draftTiming);

  useEffect(() => {
    if (!hydrated || syncedHydratedValuesRef.current) {
      return;
    }
    syncedHydratedValuesRef.current = true;
    const nextDraft = {
      clearTime: formatDraftValue(timing.clearTime),
      fullTime: formatDraftValue(timing.fullTime),
      tolerance: String(timing.tolerance),
    };
    draftTimingRef.current = nextDraft;
    setDraftTiming(nextDraft);
  }, [hydrated, timing.clearTime, timing.fullTime, timing.tolerance]);

  const handleTimingChange = (field: keyof TimingSettings, value: string) => {
    if (!DECIMAL_ENTRY_PATTERN.test(value)) {
      return;
    }
    const nextDraft = { ...draftTimingRef.current, [field]: value };
    draftTimingRef.current = nextDraft;
    setDraftTiming(nextDraft);
    setTiming(parseDraftTiming(nextDraft));
  };

  return (
    <RouteFrame
      intro="Enter the crossing times used for practice, exemplars, and replay feedback."
      preferences={state.preferences}
      title="Timing Setup"
      titleRef={titleRef}
    >
      <section className={styles.panel}>
        <label className={styles.field} htmlFor="clearTime">
          <span>Time to clear from left (first half)</span>
          <input
            id="clearTime"
            inputMode="decimal"
            onChange={(event) => handleTimingChange("clearTime", event.target.value)}
            pattern="[0-9]*[.]?[0-9]*"
            type="text"
            value={draftTiming.clearTime}
          />
        </label>
        <label className={styles.field} htmlFor="fullTime">
          <span>Full street crossing time</span>
          <input
            id="fullTime"
            inputMode="decimal"
            onChange={(event) => handleTimingChange("fullTime", event.target.value)}
            pattern="[0-9]*[.]?[0-9]*"
            type="text"
            value={draftTiming.fullTime}
          />
        </label>
        <label className={styles.field} htmlFor="marginOfError">
          <span>Margin of error</span>
          <input
            id="marginOfError"
            inputMode="decimal"
            onChange={(event) => handleTimingChange("tolerance", event.target.value)}
            pattern="[0-9]*[.]?[0-9]*"
            type="text"
            value={draftTiming.tolerance}
          />
        </label>
      </section>
      <section className={styles.panel}>
        <h2 className={styles.sectionTitle}>Current values</h2>
        <p>Time to clear from left (first half): {formatSeconds(timing.clearTime)}</p>
        <p>Full street crossing time: {formatSeconds(timing.fullTime)}</p>
        <p>Margin of error: {timing.tolerance.toFixed(2)} sec</p>
      </section>
    </RouteFrame>
  );
}
