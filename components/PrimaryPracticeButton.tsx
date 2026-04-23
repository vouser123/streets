// components/PrimaryPracticeButton.tsx — Large shared action button for practice flow.

import styles from "@/components/PrimaryPracticeButton.module.css";

interface PrimaryPracticeButtonProps {
  disabled?: boolean;
  label: string;
  onPress: () => void;
}

export function PrimaryPracticeButton({
  disabled = false,
  label,
  onPress,
}: PrimaryPracticeButtonProps) {
  return (
    <button
      aria-disabled={disabled}
      className={styles.button}
      disabled={disabled}
      onClick={onPress}
      type="button"
    >
      {label}
    </button>
  );
}
