# Streets Testing Checklists

Canonical checklist reference for Streets.

Use this file when validating behavior changes during the rebuild.

---

## Practice Flow Checklist

Trigger: any change to practice modes, marker capture, replay evaluation, or the primary practice control.

- Confirm all three modes still work:
  - `2b`
  - `2`
  - `3`
- Confirm the large primary control advances through the expected states.
- Confirm marker capture order is correct.
- Confirm replay uses the expected reference timing sequence.
- Confirm pass/fail evaluation respects the configured tolerance.
- Confirm reset behavior returns the route to a clean ready state.

## Timing Setup Checklist

Trigger: any change to required timing inputs or first-run gating.

- Confirm missing required timing values route the person into `/timing`.
- Confirm valid timing values can be saved and restored on reload.
- Confirm tolerance updates affect replay evaluation.
- Confirm timing setup is reachable and understandable with screen readers.

## Calibration Checklist

Trigger: any change to sound, visual cue, or cue-preview behavior.

- Confirm cue options render and can be selected.
- Confirm cue previews work after first user interaction.
- Confirm audio-only, visual-only, and combined preferences behave as expected.
- Confirm calibration remains separate from exemplars and preferences.

## Exemplars Checklist

Trigger: any change to exemplar playback or exemplar route structure.

- Confirm each exemplar option launches the correct sequence.
- Confirm exemplar timing matches the intended reference pattern.
- Confirm exemplar controls remain separate from calibration and preferences.

## Accessibility Checklist

Trigger: any change to navigation, announcements, text scaling, or major control layout.

- Confirm main task routes are navigable with VoiceOver.
- Confirm main task routes are navigable with TalkBack.
- Confirm route changes move focus to a meaningful heading or first control.
- Confirm large-text layouts keep primary actions reachable.
- Confirm controls have explicit labels and readable names.
- Confirm there are no modal traps for required setup tasks.

## Persistence Checklist

Trigger: any change to stored settings, defaults, or migration logic.

- Confirm saved values restore correctly after reload.
- Confirm new optional fields fall back safely for older stored data.
- Confirm corrupted or partial stored data falls back to defaults instead of breaking route render.

## Legacy Comparison Checklist

Trigger: any change intended to preserve or replace existing prototype behavior.

- Compare against [`index.html`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/index.html) for:
  - mode sequencing
  - replay timing outcomes
  - exemplar timing
  - cue behavior
- Record intentional behavior changes explicitly in the active bead or handoff.
