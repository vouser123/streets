# Streets Implementation Patterns

Use this file when you know what feature you need to build, but need the approved Streets pattern for how to build it.

Use [`../README.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/README.md) to find current file ownership.
Use this file to answer "which shared thing should I use?" and "what should I avoid re-implementing?"

Because the app source tree is still being created, this document defines the intended shared patterns for the rebuild rather than documenting a large existing component library.

## Route Ownership

- Keep `app/**/page.tsx` thin.
- Put route-level client orchestration in route-local `*Page.tsx` files.
- Put reusable UI in `components/`.
- Put state and effects in focused `hooks/`.
- Put pure calculations and shaping in `lib/`.

Do not let route hosts become mixed feature containers.

## Persistence

- Keep persisted app state in a versioned local browser contract owned by `lib/practice-storage.ts` and the persistence hooks built on top of it.
- Do not scatter raw `localStorage.getItem` and `localStorage.setItem` calls across route hosts and shared components.
- Keep default-state and migration logic in `lib`, not inline in pages.

## Audio And Announcements

- Use shared browser-media hooks for audio and spoken output readiness.
- Keep browser unlock and warm-up logic in dedicated hooks instead of re-implementing `AudioContext` or `speechSynthesis` setup in multiple places.
- Keep cue sequencing in one shared hook owner so sounds and announcements remain ordered and testable.

## Practice Flow

- Keep practice-session state transitions in a dedicated orchestration hook.
- Keep replay-event generation and pass/fail evaluation as pure `lib` logic.
- Keep the large primary control render-only; it should receive state and handlers through props instead of owning practice calculations.

## Accessibility And Navigation

- Prefer dedicated screens over modal-based settings for major task areas.
- Keep route-focus and live-announcement behavior in dedicated hooks.
- Use large targets, explicit labels, and standard navigation flow for VoiceOver and TalkBack.
- Do not hide critical setup behind hard-to-reach overlay controls.

## Touch-Safe Interaction

- Use `pointerup` rather than mouse-only click assumptions for custom primary controls.
- Use `touch-action: manipulation` on custom tappable controls and gesture-driven surfaces when appropriate.
- Keep major targets at or above 44px.
- Do not add hover-only or mouse-only assumptions to primary interactions.

## Shared-First Rule

- Before adding a new helper, check the live map in [`../README.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/README.md) and the docs index in [`README.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/README.md).
- If a shared helper, component, or hook already owns the concern, extend it or use it instead of duplicating behavior.
- If no shared pattern exists, add it deliberately and update the active docs in the same change.
