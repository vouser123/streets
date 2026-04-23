# Streets Next.js Rebuild Plan

## Summary

Rebuild Streets as a Next.js App Router app in TypeScript for Vercel, using the `pttracker` docs as the structural standard. The current `main` branch prototype remains available in parallel for comparison, but the new app gets a ground-up product and accessibility rethink rather than preserving the existing settings or menu structure. The implementation should follow the same responsibility-first placement model as `pttracker`: thin route entries, route-local `*Page` orchestrators, render-focused shared components, focused hooks, pure `lib` logic, and minimal global CSS.

## Architecture Rules to Carry Over From `pttracker`

- Use `app/` with thin route entry files only.
  - Each `app/**/page.tsx` should export metadata or viewport if needed and render a single route host component.
  - No hooks, no browser APIs, and no practice logic in route entry files.
- Put interactive route orchestration in route-local client hosts such as:
  - `app/practice/PracticePage.tsx`
  - `app/timing/TimingSetupPage.tsx`
  - `app/calibration/CalibrationPage.tsx`
  - `app/exemplars/ExemplarsPage.tsx`
  - `app/preferences/PreferencesPage.tsx`
- Keep shared UI in `components/`.
  - Components receive data and callbacks via props.
  - Components should not own practice calculations, persistence rules, or browser-service wiring.
- Keep state and effects in `hooks/`.
  - Practice session orchestration
  - Route-level form state
  - Screen reader announcements
  - Audio and haptics readiness
  - Storage hydration and persistence
- Keep pure logic and deterministic shaping in `lib/`.
  - Practice mode definitions
  - Timing comparison and replay-event generation
  - Persisted state schema, defaults, and migrations
  - Cue and exemplar sequence shaping
  - Display-label formatting where shared
- Keep `styles/globals.css` minimal.
  - CSS variables, reset, and typography tokens only
  - Route and component styling belongs in CSS modules next to owners
- Apply the same ownership discipline from `pttracker`.
  - One file equals one concern
  - Do not mix practice orchestration, calibration rules, and accessibility preferences in one file
  - If a file would need a broader name after a change, the change belongs elsewhere

## Product Structure

- Use a task-first route structure instead of mixed dialogs.
  - `/practice`
  - `/timing`
  - `/calibration`
  - `/exemplars`
  - `/preferences`
- Route into `/timing` first when required timing values are missing. Do not block practice with an interruptive modal.
- Keep `Practice` centered on one large primary control and minimal competing actions.
- Treat `Calibration` and `Exemplars` as separate task areas with separate route ownership.
- Move only true app-wide preferences into `Preferences`.
- Design navigation and screen flow for VoiceOver and TalkBack first.
  - Standard screen transitions instead of modal focus traps
  - Clear page headings and landmarks
  - Explicit navigation labels
  - Reachable task entry points with large targets

## Proposed File Shape

- `app/layout.tsx`
  - Root shell only
- `app/page.tsx`
  - Thin redirect or landing entry only
- `app/practice/page.tsx` -> `app/practice/PracticePage.tsx`
- `app/timing/page.tsx` -> `app/timing/TimingSetupPage.tsx`
- `app/calibration/page.tsx` -> `app/calibration/CalibrationPage.tsx`
- `app/exemplars/page.tsx` -> `app/exemplars/ExemplarsPage.tsx`
- `app/preferences/page.tsx` -> `app/preferences/PreferencesPage.tsx`
- `components/`
  - Shared UI only, such as task nav, primary practice button, progress markers, cue banner, calibration cards, and preference form sections
- `hooks/`
  - `usePracticeSession`
  - `usePracticePersistence`
  - `usePracticeAnnouncements`
  - `useBrowserAudioContext`
  - `useCuePlayback`
  - `useScreenReaderRouteFocus`
- `lib/`
  - `practice-modes`
  - `practice-timing`
  - `practice-replay`
  - `practice-storage`
  - `practice-defaults`
  - `practice-labels`
  - `audio-patterns`
- `styles/globals.css`
  - Tokens for readable text, control sizing floors, spacing, contrast, and large-target defaults
- `public/`
  - Static assets only

## Behavior and Implementation Decisions

- Preserve these behavioral foundations from the prototype:
  - Practice modes `2b`, `2`, and `3`
  - Marker capture and replay comparison
  - Exemplar playback
  - Selectable cue behaviors
  - Local persistence
- Rebuild the interaction model with stronger separation of responsibilities.
  - `Timing Setup` owns clear and full street times and tolerance only
  - `Calibration` owns sound and visual cue previews and selection only
  - `Exemplars` owns exemplar launch and explanation only
  - `Preferences` owns accessibility and presentation preferences only
- Use focused browser-service hooks instead of embedding media logic in page components.
- Keep persistence local for v1, but follow an explicit state-contract approach with versioned storage and migration logic.
- Watch bundle size from the start.
  - Prefer browser-native APIs over heavy client libraries
  - Treat first-load JavaScript as a budgeted resource

## Test Plan

- Unit tests in `lib` for:
  - Timing and tolerance evaluation
  - Mode-to-sequence mapping
  - Replay-event generation
  - Persisted-state decode, defaults, and migration behavior
- Hook tests for:
  - Practice-session state transitions
  - Persistence hydration and update
  - Announcement behavior and route-focus placement
  - Browser-audio readiness and cue triggering
- Component and integration tests for:
  - First-run redirect to `/timing`
  - Full practice flow for all three modes
  - Separate route ownership of calibration and exemplars
  - One large primary control behavior across practice states
  - Large text and reachable controls on narrow and mobile layouts
- Manual acceptance on Vercel previews for:
  - VoiceOver navigation to timing setup
  - TalkBack navigation to timing setup
  - Audio cue playback after first user gesture
  - Exemplar behavior matching the legacy prototype
  - Replay pass or fail behavior matching the legacy prototype
  - Side-by-side comparison against the prototype while both versions exist

## Assumptions and Defaults

- [`pttracker/docs/NEXTJS_CODE_STRUCTURE.md`](C:/Users/cindi/OneDrive/Documents/GitHub/pttracker/docs/NEXTJS_CODE_STRUCTURE.md) and [`pttracker/docs/RESPONSIBILITY_FIRST_PLACEMENT.md`](C:/Users/cindi/OneDrive/Documents/GitHub/pttracker/docs/RESPONSIBILITY_FIRST_PLACEMENT.md) are the structural source of truth for the Streets rebuild.
- The app should use App Router with thin `page.tsx` files and route-local `*Page.tsx` client hosts.
- Components remain render-focused, hooks own state and effects, and `lib` owns pure logic.
- Global CSS is limited to tokens and reset foundations.
- Modal-based settings are not part of the new architecture.
- The rebuild remains client-local for v1 with no backend or account system.
