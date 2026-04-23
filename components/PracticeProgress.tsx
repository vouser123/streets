// components/PracticeProgress.tsx — Shared stage progress display for practice mode.

import styles from "@/components/PracticeProgress.module.css";

interface PracticeProgressProps {
  currentStage: number;
  labels: string[];
  started: boolean;
}

export function PracticeProgress({ currentStage, labels, started }: PracticeProgressProps) {
  return (
    <ol className={styles.list}>
      {labels.map((label, index) => {
        const state =
          !started && index === 0
            ? "current"
            : index < currentStage
              ? "done"
              : index === currentStage
                ? "current"
                : "upcoming";
        return (
          <li key={label} className={styles.item} data-state={state}>
            <span className={styles.index}>{index + 1}</span>
            <span>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
