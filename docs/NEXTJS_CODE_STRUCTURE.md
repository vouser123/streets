# Next.js Code Structure Guidelines

Authoritative rules for code organization in the Streets Next.js App Router codebase. Apply to all route hosts and shared layers. Do not re-evaluate these decisions per session.

**Companion reference:** [`README.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/README.md) is the maintained docs map. Use this file for structure rules and [`NEXTJS_REBUILD_PLAN.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/NEXTJS_REBUILD_PLAN.md) for product scope.

---

## Size Limits

### App Router (`app/`)

| File type | Aim | Hard cap | At cap: required action |
|-----------|-----|----------|------------------------|
| Route entry (`app/**/page.tsx`) | 30L | 80L | Logic is leaking into the Server Component. Move it to `[Name]Page.tsx`. |
| Route client host (`app/**/*Page.tsx`) | 350L | 500L | Extract a component or hook before adding more code. |
| Root layout (`app/layout.tsx`) | 60L | 120L | Extract providers or shell wiring to a dedicated wrapper component. |
| App-local helper (`app/**/[^.]*.ts(x)`, excluding `page.tsx`, `layout.tsx`, `route.ts`, `*Page.tsx`) | 200L | 300L | Extract the child concern or move reusable logic to `components/`, `hooks/`, or `lib/`. |

**`page.tsx` ownership rule:** A route entry file may only contain `metadata` export, `viewport` export, and a single `return <[Name]Page />` render. No hooks, no state, and no browser logic. If it needs to pass props to the client host, those props must be derivable server-side without browser APIs or React client state.

### Shared layers

| File type | Aim | Hard cap | At cap: required action |
|-----------|-----|----------|------------------------|
| Component (`components/*.tsx`) | 200L | 300L | Split into two components before adding more code. |
| Hook (`hooks/use*.ts`) | 100L | 150L | Split by concern before adding more code. |
| Lib (`lib/*.ts`) | 300L | 450L | Apply the cohesion check before adding more code. |
| CSS Module (`*.module.css`) | 350L | 500L | Extract the component that owns the large CSS section. |
| `styles/globals.css` | — | 100L | Hard stop. CSS variables and reset only. |

### Bundle size monitoring

These are performance signals, not ownership rules. Route size does not decide where code belongs, but it does decide when profiling and reduction work must happen.

**Official guidance first:** Next.js and Vercel treat first-load JavaScript as a budget to minimize. Treat the commonly cited ~170 KB compressed target as the budget signal. If a route goes materially above that budget, identify what is in the bundle, what can be reduced now, and what explicit tradeoff is being accepted.

**For Streets specifically:**

- Prefer browser-native APIs over adding libraries for audio, storage, routing helpers, or UI state.
- Avoid broad client dependencies for a product that should remain small and fast.
- Keep route hosts lean and move route-shared work into focused hooks or pure `lib` helpers.

| Trigger | Action |
|---------|--------|
| Route or shared floor materially exceeds budget guidance | Run bundle analysis, identify the exact shared and route-specific sources, and record the findings before merge. |
| Route regresses materially from its recorded baseline | Investigate before merging and find the exact import chain or feature that increased first-load JavaScript. |
| Shared floor carries packages the app does not clearly need on first load | Treat as active reduction work, not as an acceptable default. |

**At or above cap:** Must resolve before adding more code.

**Between aim and cap:** Acceptable only when ownership is still clear and cohesive.

**When no clean split exists:** Do not violate the cap unilaterally. Surface the file size, the cap, and why no clean split is apparent.

---

## Core Principle

One file equals one complete concern, not one file equals the smallest possible file. Two files that are always loaded together are worse than one moderate file. The right split is along true domain boundaries: things used independently belong in separate files, while things always loaded together may belong in one file.

This repo is intended to be maintained safely by future agents with no shared memory of the current session. Optimize for narrow ownership boundaries that let a future agent load the fewest files necessary, understand quickly what a file owns, and make a change with low collateral risk.

---

## Responsibility-First Placement

Use [`RESPONSIBILITY_FIRST_PLACEMENT.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/RESPONSIBILITY_FIRST_PLACEMENT.md) for the short canonical wording of the pre-edit ownership test.

---

## Cohesion Check

Do not treat a file as cohesive just because you can describe it with one broad umbrella phrase. The real standard is whether the file contains independently changeable concerns that future agents would benefit from editing separately.

Ask:

- Would a future agent reasonably want to change this part without changing the rest?
- Does this responsibility have its own lifecycle, side effects, UI surface, or data-shaping rules?
- Would extracting it reduce collateral reasoning and editing risk for future work?

If yes, that is evidence the file may need extraction even if the contents sound related at a high level.

**Filename domain test:** Before adding a function to an existing file or before splitting a file, ask:

> "Would I need to rename this file to accurately describe what it contains after adding this?"

- If yes, the addition does not belong here. Place it in a different file.
- If no, the file is still one domain. Continue.

**File header comment is a contract:** Every non-trivial file should have a 1-line header comment describing its domain. If writing the comment would require joining two feature areas, the file must be split.

---

## Split Decision Rules

1. Is a cap violated? Must split, or surface the problem if no clean split exists.
2. Does the cohesion check fail? Must split regardless of size.
3. Would the split pieces always be loaded together? Do not split artificially.
4. Is the file under cap and cohesion still clear? Keep it together only if the contents are still best understood and changed as one concern.

Do not split only to reach the aim number. A 350-line `lib` file covering one domain can be correct. A 150-line file mixing two domains must split.

---

## Import Layer Rules

### App Router

| Layer | May import from |
|-------|----------------|
| `app/**/page.tsx` (Server Component) | `app/**/*Page.tsx` only. No hooks, no `lib`, and no shared components directly. |
| `app/**/*Page.tsx` (`'use client'`) | `components/`, `hooks/`, `lib/`, own CSS module |
| `app/layout.tsx` (Server Component) | `styles/globals.css`, `app/components/` only |
| `app/components/` and route-local helpers | Same rules as `components/` when UI-only. Otherwise extract reusable state to `hooks/` or pure shaping to `lib/`. |

### Shared layers

| Layer | May import from |
|-------|----------------|
| `components/` | other `components/`, own CSS module, type-only imports as needed |
| `hooks/` | React, `lib/`, and type-only imports |
| `lib/` | other `lib/` files, shared types, and browser-native or platform-safe utilities only |
| `styles/globals.css` | nothing |

An import outside these rules signals misplaced responsibility. Fix the placement, not the import.

---

## Folder Structure

App Router routes live in `app/`. If a `pages/` directory is kept, it is compatibility-only and must not contain route code.

```text
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── components/
│   ├── practice/
│   │   ├── page.tsx
│   │   └── PracticePage.tsx
│   ├── timing/
│   │   ├── page.tsx
│   │   └── TimingSetupPage.tsx
│   ├── calibration/
│   │   ├── page.tsx
│   │   └── CalibrationPage.tsx
│   ├── exemplars/
│   │   ├── page.tsx
│   │   └── ExemplarsPage.tsx
│   ├── preferences/
│   │   ├── page.tsx
│   │   └── PreferencesPage.tsx
│   └── api/
│
├── components/
│   ├── [Name].tsx
│   └── [Name].module.css
│
├── hooks/
│   └── use[Name].ts
│
├── lib/
│   └── [domain].ts
│
├── styles/
│   └── globals.css
│
├── public/
└── docs/
```

**Placement decisions:**

- New UI piece with state or reuse goes in `components/` or in a route-local helper under `app/` if it only belongs to one route surface.
- New pure logic goes in `lib/[domain].ts`.
- New state and effects logic reused across multiple places goes in `hooks/use[Name].ts`.
- New styles go in a CSS Module next to the owning component or route host.
- `styles/globals.css` is limited to shared tokens and reset behavior.

---

## Server and Client Boundary Rules

App Router adds an explicit server and client split. Treat that split as an ownership rule, not just a syntax rule.

**Default:** keep `app/**/page.tsx` and `app/layout.tsx` as Server Components.

Add `'use client'` only when the file needs one of these:

- React client hooks such as `useState`, `useEffect`, `useRef`, or `useDeferredValue`
- Event handlers such as `onPointerUp`, `onChange`, or `onKeyDown`
- Browser APIs such as `window`, `document`, `localStorage`, `matchMedia`, `navigator`, or audio APIs
- Client-only shared hooks

Keep a file server-side when it is pure display or server-safe wiring:

- Metadata or viewport exports
- Rendering static or derived markup from props
- Route entry files that only delegate to a route-local client host

**Push `'use client'` down the tree.** Do not mark a route entry or layout as client-side because one child needs interactivity.

**Route pattern for this repo:**

- `app/**/page.tsx` = thin Server Component route entry
- `app/**/[Name]Page.tsx` = route-local client orchestrator when the route is interactive
- `components/` = shared interactive or presentational building blocks under that host

If a future edit would force `'use client'` onto `app/**/page.tsx`, pause and move the concern into a route-local `*Page.tsx` or a deeper child.

---

## TypeScript Conventions

- Prefer `.ts` for hooks, `lib`, and shared types that do not render JSX.
- Prefer `.tsx` for route hosts and components that render JSX.
- Use explicit exported types for persisted state, replay events, and route-facing props.
- Keep type-only imports marked with `import type` where appropriate.
- Avoid broad `any` usage. If an unknown external shape must be handled, narrow it at the boundary and keep the rest of the app typed.

---

## What Next.js Enforces Versus What The Repo Still Enforces

Next.js helps enforce route shape and server or client boundaries, but it does not fully enforce the repo architecture by itself.

### Framework-enforced boundaries

- `app/**/page.tsx`, `app/**/layout.tsx`, and `app/**/route.ts` have distinct framework jobs
- Server and client boundaries are explicit through `'use client'`
- Browser-only APIs cannot run in Server Components
- Invalid route shapes often fail at build time

### Repo-enforced architecture rules

- `app/**/page.tsx` must stay a thin route entry, not a feature host
- Route client hosts such as `*Page.tsx` are orchestrators, not dumping grounds
- Business logic belongs in `lib/`, not route files or shared components
- State and effect workflows belong in focused hooks
- Reusable UI belongs in `components/`

Some decisions still require judgment:

- whether a concern is truly one domain or several mixed together
- whether a helper belongs in a route host, a hook, a component, or `lib/`
- whether a new dependency is justified for a browser-native problem
