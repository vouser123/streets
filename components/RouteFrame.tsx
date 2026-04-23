// components/RouteFrame.tsx — Shared page shell for task-first Streets routes.

import type { ReactNode, RefObject } from "react";
import styles from "@/components/RouteFrame.module.css";
import { TaskNav } from "@/components/TaskNav";

interface RouteFramePreferences {
  focusBoost: boolean;
  highContrast: boolean;
  theme: "system" | "light" | "dark";
}

interface RouteFrameProps {
  children: ReactNode;
  intro: string;
  preferences: RouteFramePreferences;
  title: string;
  titleRef?: RefObject<HTMLHeadingElement | null>;
}

export function RouteFrame({ children, intro, preferences, title, titleRef }: RouteFrameProps) {
  return (
    <main
      className={styles.page}
      data-focus-boost={preferences.focusBoost}
      data-high-contrast={preferences.highContrast}
      data-theme={preferences.theme}
    >
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.content}>
        <TaskNav />
        <header className={styles.header}>
          <p className={styles.kicker}>Streets Rebuild</p>
          <h1 className={styles.title} ref={titleRef} tabIndex={-1}>
            {title}
          </h1>
          <p className={styles.intro}>{intro}</p>
        </header>
        {children}
      </div>
    </main>
  );
}
