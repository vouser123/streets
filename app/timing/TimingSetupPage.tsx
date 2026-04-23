// app/timing/TimingSetupPage.tsx - Client timing setup host for core street times.

"use client";

import styles from "@/app/timing/TimingSetupPage.module.css";
import { RouteFrame } from "@/components/RouteFrame";
import { usePracticePersistence } from "@/hooks/usePracticePersistence";
import { useScreenReaderRouteFocus } from "@/hooks/useScreenReaderRouteFocus";
import { formatSeconds } from "@/lib/practice-labels";

export function TimingSetupPage() {
  const titleRef = useScreenReaderRouteFocus<HTMLHeadingElement>();
  const { state, setTiming } = usePracticePersistence();
  const timing = state.timing;

  return (
    <RouteFrame
      intro="Timing Setup owns the clear time, full street time, and tolerance only. This screen is intended to be reachable quickly with mobile screen readers."
      preferences={state.preferences}
      title="Timing Setup"
      titleRef={titleRef}
    >
      <section className={styles.panel}>
        <label className={styles.field}>
          <span>Time to clear from left</span>
          <input
            inputMode="decimal"
            min="0"
            onChange={(event) =>
              setTiming({
                ...timing,
                clearTime: event.target.value ? Number(event.target.value) : null,
              })
            }
            type="number"
            value={timing.clearTime ?? ""}
          />
        </label>
        <label className={styles.field}>
          <span>Full street time</span>
          <input
            inputMode="decimal"
            min="0"
            onChange={(event) =>
              setTiming({
                ...timing,
                fullTime: event.target.value ? Number(event.target.value) : null,
              })
            }
            type="number"
            value={timing.fullTime ?? ""}
          />
        </label>
        <label className={styles.field}>
          <span>Tolerance</span>
          <input
            inputMode="decimal"
            min="0"
            onChange={(event) =>
              setTiming({
                ...timing,
                tolerance: event.target.value ? Number(event.target.value) : 0,
              })
            }
            type="number"
            value={timing.tolerance}
          />
        </label>
      </section>
      <section className={styles.panel}>
        <h2 className={styles.sectionTitle}>Current values</h2>
        <p>Clear time: {formatSeconds(timing.clearTime)}</p>
        <p>Full street time: {formatSeconds(timing.fullTime)}</p>
        <p>Tolerance: {timing.tolerance.toFixed(2)} sec</p>
      </section>
    </RouteFrame>
  );
}
