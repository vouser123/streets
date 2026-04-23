// components/VisualCuePanel.tsx — Shared visual cue surface for practice and exemplars.

import styles from "@/components/VisualCuePanel.module.css";

type VisualVariant = "up" | "down" | "diamond";
type UserFlashContrast = "soft" | "balanced" | "high";

interface VisualCuePanelProps {
  activeKind: "user" | "acceptable" | "outside" | null;
  label: string;
  outsideVisualVariant: VisualVariant;
  userFlashContrast: UserFlashContrast;
}

export function VisualCuePanel({
  activeKind,
  label,
  outsideVisualVariant,
  userFlashContrast,
}: VisualCuePanelProps) {
  return (
    <div
      aria-hidden={activeKind === null}
      className={styles.panel}
      data-active={activeKind !== null}
      data-kind={activeKind ?? "idle"}
      data-variant={outsideVisualVariant}
      data-user-contrast={userFlashContrast}
    >
      <div className={styles.shape} />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
