// app/calibration/CalibrationPage.tsx - Client calibration host for sound and visual cues.

"use client";

import { useRef, useState } from "react";
import styles from "@/app/calibration/CalibrationPage.module.css";
import { RouteFrame } from "@/components/RouteFrame";
import { VisualCuePanel } from "@/components/VisualCuePanel";
import { useCuePlayback } from "@/hooks/useCuePlayback";
import { usePracticePersistence } from "@/hooks/usePracticePersistence";
import { useScreenReaderRouteFocus } from "@/hooks/useScreenReaderRouteFocus";
import {
  ACCEPTABLE_TONE_OPTIONS,
  OUTSIDE_TONE_OPTIONS,
  USER_TONE_OPTIONS,
} from "@/lib/audio-patterns";

const VISUAL_PREVIEW_LEAD_IN_MS = 500;
const VISUAL_PREVIEW_VISIBLE_MS = 200;
const VISUAL_PREVIEW_EXIT_MS = 500;

export function CalibrationPage() {
  const titleRef = useScreenReaderRouteFocus<HTMLHeadingElement>();
  const { state, setCalibration } = usePracticePersistence();
  const { playFeedbackPreview, playUserPreview } = useCuePlayback();
  const [visualKind, setVisualKind] = useState<"user" | "acceptable" | "outside" | null>(null);
  const [visualLabel, setVisualLabel] = useState("Preview ready");
  const visualPreviewTimersRef = useRef<number[]>([]);

  const calibration = state.calibration;
  const clearVisualPreviewTimers = () => {
    visualPreviewTimersRef.current.forEach((timer) => {
      window.clearTimeout(timer);
    });
    visualPreviewTimersRef.current = [];
  };

  const previewVisualCue = (kind: "user" | "acceptable" | "outside", label: string) => {
    clearVisualPreviewTimers();
    setVisualKind(kind);
    setVisualLabel(label);
    visualPreviewTimersRef.current = [
      window.setTimeout(
        () => {
          setVisualKind(null);
          setVisualLabel("Preview ready");
          visualPreviewTimersRef.current = [];
        },
        VISUAL_PREVIEW_LEAD_IN_MS + VISUAL_PREVIEW_VISIBLE_MS + VISUAL_PREVIEW_EXIT_MS,
      ),
    ];
  };

  return (
    <RouteFrame
      intro="Choose the sound, visual, vibration, and spoken cue feedback used during practice and exemplars."
      preferences={state.preferences}
      title="Calibration"
      titleRef={titleRef}
    >
      <section className={styles.panel}>
        <h2 className={styles.sectionTitle}>Feedback tones</h2>
        <fieldset className={styles.optionGroup}>
          <legend className={styles.groupLegend}>On target</legend>
          {ACCEPTABLE_TONE_OPTIONS.map((option) => (
            <div key={option.id} className={styles.optionCard}>
              <label className={styles.optionLabel}>
                <input
                  checked={calibration.acceptableToneId === option.id}
                  name="acceptable-tone"
                  onChange={() => setCalibration({ ...calibration, acceptableToneId: option.id })}
                  type="radio"
                />
                <span>
                  <strong>{option.label}</strong>
                  <span className={styles.optionDescription}>{option.description}</span>
                </span>
              </label>
              <button
                className={styles.previewButton}
                onClick={() => void playFeedbackPreview(option.id)}
                type="button"
              >
                Preview {option.label}
              </button>
            </div>
          ))}
        </fieldset>
        <fieldset className={styles.optionGroup}>
          <legend className={styles.groupLegend}>Needs adjustment</legend>
          {OUTSIDE_TONE_OPTIONS.map((option) => (
            <div key={option.id} className={styles.optionCard}>
              <label className={styles.optionLabel}>
                <input
                  checked={calibration.outsideToneId === option.id}
                  name="outside-tone"
                  onChange={() => setCalibration({ ...calibration, outsideToneId: option.id })}
                  type="radio"
                />
                <span>
                  <strong>{option.label}</strong>
                  <span className={styles.optionDescription}>{option.description}</span>
                </span>
              </label>
              <button
                className={styles.previewButton}
                onClick={() => void playFeedbackPreview(option.id)}
                type="button"
              >
                Preview {option.label}
              </button>
            </div>
          ))}
        </fieldset>
        <fieldset className={styles.optionGroup}>
          <legend className={styles.groupLegend}>User replay tone</legend>
          {USER_TONE_OPTIONS.map((option) => (
            <div key={option.id} className={styles.optionCard}>
              <label className={styles.optionLabel}>
                <input
                  checked={calibration.userToneId === option.id}
                  name="user-tone"
                  onChange={() => setCalibration({ ...calibration, userToneId: option.id })}
                  type="radio"
                />
                <span>
                  <strong>{option.label}</strong>
                  <span className={styles.optionDescription}>{option.description}</span>
                </span>
              </label>
              <button
                className={styles.previewButton}
                onClick={() => void playUserPreview(option.id)}
                type="button"
              >
                Preview {option.label}
              </button>
            </div>
          ))}
        </fieldset>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.sectionTitle}>Output</h2>
        <label className={styles.field}>
          <span>Output mode</span>
          <select
            onChange={(event) =>
              setCalibration({
                ...calibration,
                outputMode: event.target.value as typeof calibration.outputMode,
              })
            }
            value={calibration.outputMode}
          >
            <option value="audio-only">Audio only</option>
            <option value="audio-visual">Audio and visual</option>
            <option value="visual-only">Visual only</option>
          </select>
        </label>
        <label className={styles.toggle}>
          <input
            checked={calibration.showBanner}
            onChange={(event) =>
              setCalibration({ ...calibration, showBanner: event.target.checked })
            }
            type="checkbox"
          />
          <span>Show cue banner</span>
        </label>
        <label className={styles.toggle}>
          <input
            checked={calibration.flashAction}
            onChange={(event) =>
              setCalibration({ ...calibration, flashAction: event.target.checked })
            }
            type="checkbox"
          />
          <span>Flash on action</span>
        </label>
        <label className={styles.toggle}>
          <input
            checked={calibration.vibrate}
            onChange={(event) => setCalibration({ ...calibration, vibrate: event.target.checked })}
            type="checkbox"
          />
          <span>Use vibration where available</span>
        </label>
        <label className={styles.toggle}>
          <input
            checked={calibration.syncVisualReplay}
            onChange={(event) =>
              setCalibration({ ...calibration, syncVisualReplay: event.target.checked })
            }
            type="checkbox"
          />
          <span>Sync visual replay</span>
        </label>
        <label className={styles.toggle}>
          <input
            checked={calibration.announceCues}
            onChange={(event) =>
              setCalibration({ ...calibration, announceCues: event.target.checked })
            }
            type="checkbox"
          />
          <span>Speak cue announcements</span>
        </label>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.sectionTitle}>Visual shape</h2>
        <label className={styles.field}>
          <span>Adjustment cue shape</span>
          <select
            onChange={(event) =>
              setCalibration({
                ...calibration,
                outsideVisualVariant: event.target.value as typeof calibration.outsideVisualVariant,
              })
            }
            value={calibration.outsideVisualVariant}
          >
            <option value="up">Triangle up</option>
            <option value="down">Triangle down</option>
            <option value="diamond">Diamond</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>User flash contrast</span>
          <select
            onChange={(event) =>
              setCalibration({
                ...calibration,
                userFlashContrast: event.target.value as typeof calibration.userFlashContrast,
              })
            }
            value={calibration.userFlashContrast}
          >
            <option value="soft">Soft</option>
            <option value="balanced">Balanced</option>
            <option value="high">High</option>
          </select>
        </label>
        <div className={styles.previewRow}>
          <button
            className={styles.previewButton}
            onClick={() => previewVisualCue("user", "User flash preview")}
            type="button"
          >
            Preview user flash
          </button>
          <button
            className={styles.previewButton}
            onClick={() => previewVisualCue("acceptable", "On target preview")}
            type="button"
          >
            Preview on-target cue
          </button>
          <button
            className={styles.previewButton}
            onClick={() => previewVisualCue("outside", "Needs adjustment preview")}
            type="button"
          >
            Preview adjustment cue
          </button>
        </div>
        <VisualCuePanel
          activeKind={visualKind}
          label={visualLabel}
          outsideVisualVariant={calibration.outsideVisualVariant}
          previewTiming={visualKind !== null}
          userFlashContrast={calibration.userFlashContrast}
        />
      </section>
    </RouteFrame>
  );
}
