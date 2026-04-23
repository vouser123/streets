// components/CueBanner.tsx — Shared cue banner for practice and exemplars.

import styles from "@/components/CueBanner.module.css";

interface CueBannerProps {
  activeKind?: "user" | "acceptable" | "outside" | null;
  message: string;
}

export function CueBanner({ activeKind, message }: CueBannerProps) {
  return (
    <div
      aria-live="polite"
      className={styles.banner}
      data-kind={activeKind ?? "idle"}
      role="status"
    >
      {message}
    </div>
  );
}
