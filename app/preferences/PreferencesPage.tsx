// app/preferences/PreferencesPage.tsx - Client preferences host for app-wide accessibility options.

"use client";

import styles from "@/app/preferences/PreferencesPage.module.css";
import { RouteFrame } from "@/components/RouteFrame";
import { usePracticePersistence } from "@/hooks/usePracticePersistence";
import { useScreenReaderRouteFocus } from "@/hooks/useScreenReaderRouteFocus";

export function PreferencesPage() {
  const titleRef = useScreenReaderRouteFocus<HTMLHeadingElement>();
  const { state, setPreferences } = usePracticePersistence();
  const preferences = state.preferences;

  return (
    <RouteFrame
      intro="Preferences holds app-wide accessibility and presentation choices only, separated from timing and cue setup."
      preferences={preferences}
      title="Preferences"
      titleRef={titleRef}
    >
      <section className={styles.panel}>
        <label className={styles.field}>
          <span>Theme</span>
          <select
            onChange={(event) =>
              setPreferences({
                ...preferences,
                theme: event.target.value as typeof preferences.theme,
              })
            }
            value={preferences.theme}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <p className={styles.note}>
          Text sizing should come from device or browser accessibility settings, so this app does
          not override it.
        </p>
        <label className={styles.toggle}>
          <input
            checked={preferences.highContrast}
            onChange={(event) =>
              setPreferences({ ...preferences, highContrast: event.target.checked })
            }
            type="checkbox"
          />
          <span>High contrast</span>
        </label>
        <label className={styles.toggle}>
          <input
            checked={preferences.focusBoost}
            onChange={(event) =>
              setPreferences({ ...preferences, focusBoost: event.target.checked })
            }
            type="checkbox"
          />
          <span>Focus boost</span>
        </label>
        <label className={styles.toggle}>
          <input
            checked={preferences.useTextLabels}
            onChange={(event) =>
              setPreferences({ ...preferences, useTextLabels: event.target.checked })
            }
            type="checkbox"
          />
          <span>Prefer text labels over shorthand</span>
        </label>
        <label className={styles.toggle}>
          <input
            checked={preferences.reducedMotion}
            onChange={(event) =>
              setPreferences({ ...preferences, reducedMotion: event.target.checked })
            }
            type="checkbox"
          />
          <span>Reduce motion</span>
        </label>
      </section>
    </RouteFrame>
  );
}
