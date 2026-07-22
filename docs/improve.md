# RentEase — UI/UX & Motion Remediation Plan

This document replaces the previous `docs/improve.md`. It is a prioritized, actionable punch list for an engineering agent covering twelve reported UI/UX and routing issues. It's derived from a full read of the actual source (not assumptions) — every item below cites the real file and, where relevant, the exact line-level cause. Work top to bottom within each tier; some items depend on earlier ones.

Do not mark anything complete without meeting its acceptance criteria.

---

## Tier A — Cinematic hero sequence (issues 1–4, 8)

These five issues all live in the same three files and should be done together as one pass, since they touch overlapping state (`progress`, phase flags, session-skip logic).

**Files:** `src/components/hero/HeroCanvasAnimation.tsx`, `src/components/hero/ScrollTextPanel.tsx`, `src/components/hero/heroTimeline.ts`, `src/hooks/useScrollVideoSync.ts`, `src/app/page.tsx`, `src/app/globals.css`

### 1. Replace story-panel cards with clean animated text

**Problem:** `ScrollTextPanel.tsx` wraps every scroll-triggered story beat in a glass-morphism card: `rounded-3xl border border-white/10 bg-black/60 p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7)]`, plus a pill-shaped badge with a `Sparkles` icon. This is the "overly AI-generated" look.

**Fix:** Remove the card container entirely (no border, no background fill, no blur, no shadow, no badge pill). Replace with typography directly over the footage: large heading with a staggered word/line reveal (Framer Motion `staggerChildren` on words, or a clip-path wipe), a lighter-weight subhead fading in slightly after. Keep the existing `position` (left/right/center) placement logic and the same `active` in/out timing — only the visual treatment of the content changes, not the timeline.

**Acceptance criteria:** No `rounded-*`, `bg-black/*`, `backdrop-blur`, or badge pill remains in `ScrollTextPanel.tsx`. Text is legible against all frame backgrounds without a scrim card (add a subtle text-shadow if needed for contrast instead of a panel background).

### 2. Make the scroll animation fully visible in the foreground

**Problem:** In `HeroCanvasAnimation.tsx`, the canvas frame sequence has `brightness-[0.45]` hardcoded as a permanent Tailwind class (not tied to scroll state), and there's a permanent dark scrim `<div>` layered on top (`bg-gradient-to-t from-[#050505] via-black/40 to-[#050505]/80`). Both apply for the entire scroll duration, which is why the footage always reads as backgrounded/dim instead of being the main visual during the cinematic sequence.

**Fix:** Make brightness and scrim opacity a function of `progressPercent`, using the same crossfade approach already used for `initialOpacity`/`finalOpacity`:
- Phases 1–3 (roughly 0–74%): brightness ~100%, scrim opacity ~0 (or very low, just enough for text legibility).
- Phase 4 (75–100%, `isFinalActive`): ramp brightness down toward ~0.4–0.45 and scrim opacity up, synced with `finalOpacity`, so the footage recedes into the background exactly as the final hero content takes over.

**Acceptance criteria:** During phases 1–3, the frame sequence is the dominant visual (full brightness, no scrim). Only during phase 4 does it dim and push behind the final hero content.

### 3. Navbar slides down only when the animation finishes

**Problem:** In `src/app/page.tsx` (~line 177), `<header>` is `fixed top-0 left-0 w-full z-50 ...` unconditionally — always visible from first paint, with no connection to scroll progress at all.

**Fix:** Lift the `progress`/`isFinalActive` state (or the underlying `useScrollVideoSync` hook) so `page.tsx` can read it, or expose a small context/callback from `HeroCanvasAnimation`. Default the header to hidden (`-translate-y-full opacity-0`, `pointer-events-none`), and animate it to `translate-y-0 opacity-100` once `progressPercent >= HERO_TIMELINE_CONFIG.ranges.phase4.start` (the same threshold `HeroCanvasAnimation.tsx` already uses for `isFinalActive`). Use a Framer Motion `transition` (~0.5s ease-out) for the slide, not an instant toggle.

**Acceptance criteria:** On first load, no navbar is visible until the scroll sequence reaches the final hero state, at which point it slides down smoothly. On repeat visits within the same session (see #8), the navbar should already be visible on load, matching the resting hero state.

### 4. Remove the "Direct Renting, Redefined" badge — both instances

**Problem:** The badge text is defined twice in `heroTimeline.ts` and rendered in two places in `HeroCanvasAnimation.tsx`:
- `INITIAL_HERO_COPY.badge` → rendered at lines ~172–176 (initial state, 0–8% progress), with a pulsing dot.
- `FINAL_HERO_COPY.badge` → rendered at lines ~228–232 (final resting state, 75–100% progress), with a `Sparkles` icon.

**Fix:** Delete both badge blocks from `HeroCanvasAnimation.tsx`, and remove the now-unused `badge` fields from `INITIAL_HERO_COPY` and `FINAL_HERO_COPY` in `heroTimeline.ts` (or leave the data and just stop rendering it — agent's choice, but don't leave dead render code).

**Acceptance criteria:** Neither the intro state nor the final resting hero state shows the badge/pill. `grep -rn "DIRECT RENTING REDEFINED" src` returns no active render sites.

### 8. Play the intro once per browser session

**Problem:** This is partially built and currently non-functional. In `src/app/page.tsx` (~lines 98–109):
```js
const hasSeen = sessionStorage.getItem("hasSeenIntro");   // only ever READ
if (hasSeen || document.documentElement.classList.contains("skip-intro")) {
  setSkipIntro(true);
  document.documentElement.classList.add("skip-intro");
}
```
`sessionStorage.setItem("hasSeenIntro", ...)` is **never called anywhere in the codebase** — the flag can never become true, so this block is permanently dead after the first render. Separately, `globals.css` (line 174) defines:
```css
.skip-intro .intro-section { display: none !important; }
```
but **no element anywhere has the class `intro-section`** — this rule can never match anything even once the class-toggle bug above is fixed. Additionally, `skipIntro` (the React state) is set but never read/used to conditionally render anything.

**Fix:**
- Call `sessionStorage.setItem("hasSeenIntro", "true")` once the scroll sequence reaches phase 4 / `isFinalActive` becomes true (not on mount — it needs to fire after the user has actually seen it once).
- On mount, if `sessionStorage.getItem("hasSeenIntro")` is truthy, skip rendering the pinned scroll section (`HeroScrollAnimation`) entirely and render the final hero state directly instead — don't just hide it with CSS, since the underlying `useScrollVideoSync` hook still creates a `900vh`/`600vh` GSAP pin spacer (`HERO_TIMELINE_CONFIG.spacerHeight`/`mobileSpacerHeight`) regardless of visibility, which would leave a large blank scroll gap if only hidden via `display:none`.
- Use `skipIntro` (already defined) as the actual conditional flag for this branch; remove the dead `.skip-intro`/`.intro-section` CSS since it won't be needed once the conditional render approach is used.
- Navbar (#3) should render in its visible/slid-down state immediately when `skipIntro` is true.

**Acceptance criteria:** First visit in a session plays the full cinematic sequence. Navigating to another page and back to `/` within the same browser session loads directly at the final hero state — no pinned scroll spacer, no replayed animation, navbar already visible. Closing and reopening the browser (new session) plays the intro again.

---

## Tier B — Interaction & routing bugs (issues 5, 6, 7, 9)

### 5. Property card expansion animation

**Problem:** The exact same buggy pattern is **duplicated in two separate files** — `src/app/page.tsx` (`ExpandedCard`, ~line 831, used by the homepage carousel and grid) and `src/components/property/PropertyListingGrid.tsx` (`ExpandedCard`, ~line 139, used on `/properties`). Both have identical root causes:
- `textVisible` (gates the detail-text opacity) is set to `true` via a one-shot `setTimeout(500ms)` on mount, and **never reset to `false` on close**. When the card closes, the container tweens back down to thumbnail size over 0.5s while the full detail text is still rendered at full opacity inside it — this is the overlap/mixing artifact.
- Neither `<ExpandedCard>` instance receives a `key={property.id}` prop. Clicking a different card while one is still animating updates props on the same mounted instance instead of triggering an unmount/remount, so `AnimatePresence` never runs an exit/enter cycle between two different properties — content can swap mid-transition.
- No scroll lock (`document.body` overflow is untouched) while the modal is open, and the open/close transition tweens between **raw pixel values captured once** via `getBoundingClientRect()` at click time (`rect.top`, `rect.left`, etc.). If the page scrolls at all while expanded, the close animation returns to stale coordinates that no longer match the card's actual on-screen position — a visible jump/glitch on close.

**Fix:**
- Extract one shared `PropertyExpandCard` component used by both call sites — stop maintaining two copies of the same logic.
- Reset `textVisible` to `false` immediately when `onClose` fires (or better, drive text visibility off the container's own animation `onAnimationComplete`/`onUpdate` rather than an independent fixed timer).
- Pass `key={property.id}` on the `<ExpandedCard>` element so switching properties always unmounts/remounts cleanly.
- Lock `document.body` scroll (e.g. `overflow: hidden`) for the duration the modal is open, and release it on close/unmount.
- Prefer refactoring to Framer Motion's `layoutId` shared-layout animation (the built-in solution for a thumbnail→full-screen→thumbnail transition) instead of manually tweening a captured rect — this removes the stale-coordinate class of bug entirely. If keeping the manual-rect approach instead, re-measure the origin element's position on close rather than trusting the value captured at open time.

**Acceptance criteria:** Opening and closing a card is smooth with no visible text/content overlap at any point in the transition, on both the homepage and `/properties`. Rapidly clicking between two different property cards never shows mixed content. Scrolling is locked while a card is expanded. Only one shared implementation exists (no duplicate `ExpandedCard`).

### 6. Dashboard route not opening

**Problem:** `src/app/dashboard/page.tsx` is a pure redirect dispatcher:
```js
if (user.roles.includes("owner")) redirect("/owner/dashboard");
// Tenants do not have a dedicated dashboard, redirect back to home page
redirect("/");
```
For any logged-in **tenant** (the majority end-user role — `UserRole = "tenant" | "owner"`), clicking "Dashboard" silently bounces back to `/` with zero feedback. From the user's perspective this looks exactly like "the dashboard doesn't open." Separately, there is **no `error.tsx` anywhere in the app** (checked — zero exist at any route level), so if this is instead a genuine runtime exception (e.g. Firebase Admin misconfiguration), it would render Next's raw error overlay instead of a graceful message. Unlike `src/app/owner/dashboard/page.tsx`, this route also doesn't check `isAdminConfigured()` before calling `getCurrentUser()`.

**Fix — do both:**
- Decide the actual intended behavior for tenants: either build a minimal tenant dashboard (saved searches, favorited properties, inquiry history — there's already an `inquiries` collection and `favorites` collection to back this), or, if tenants intentionally have no dashboard, replace the silent `redirect("/")` with a redirect to a specific, meaningful place (e.g. `/properties` or `/?tenant-home=1`) and/or a toast/message explaining why, rather than a bare bounce that looks broken.
- Add a root-level `src/app/error.tsx` (and one under `src/app/dashboard/` and `src/app/owner/`) so any real runtime exception degrades to a friendly error screen instead of a crash.
- **Before implementing, verify which failure mode is actually occurring** — log in as a tenant and check whether you land back on `/` (routing-logic issue, fix above) or see an actual error/blank page (runtime issue — check server console/browser devtools for the real stack trace first).

**Acceptance criteria:** A logged-in tenant clicking "Dashboard" reaches a real, intentional destination (not a silent bounce). A logged-in owner reaches `/owner/dashboard` as before. Any unexpected server error anywhere under these routes renders a friendly error boundary, not a raw crash.

### 7 & 9. Properties page error / `?type=villa` error

**Problem:** Found the exact bug. `src/lib/firebase/types.ts` defines:
```ts
export type PropertyType = "house" | "apartment" | "room" | "hostel" | "shop";
```
**"villa" is not a valid type anywhere in the schema** — yet the homepage's own "Discover By Type" category grid (`src/app/page.tsx`, ~line 546) links directly to it:
```js
{ title: "Villa Estates", type: "villa", count: "48 Listings", ... }      // → /properties?type=villa
{ title: "Sky Penthouses", type: "penthouse", count: "24 Listings", ... } // → /properties?type=penthouse (same bug)
```
`getProperties()` in `src/lib/data/properties.ts` (already correctly using indexed Firestore `.where()` chains, not in-memory scanning) builds `.where("status","==","approved").where("type","==","villa")`. The composite index for `status+type+createdAt` **is defined** in `firebase/firestore.indexes.json` (lines 27–35) — but a definition in that file only takes effect once deployed with `firebase deploy --only firestore:indexes`; it's worth confirming that's actually been run against the live project. Independently of the index question, there is **no `try/catch`** around the `getProperties()` calls in `src/app/properties/page.tsx` and no `error.tsx` boundary anywhere in the app, so any Firestore exception (missing index, malformed filter, etc.) surfaces as a raw crash instead of a graceful "no results" or error state.

**Fix:**
- Fix the content bug at the source: either remove/replace the "Villa Estates" and "Sky Penthouses" homepage category tiles with real `PropertyType` values (`house`, `apartment`, `room`, `hostel`, `shop`), or, if villa/penthouse should genuinely exist as categories, add them to the `PropertyType` union in `types.ts`, to Firestore security rules validation if it enumerates types, and seed/allow real data for them.
- Confirm the Firestore composite indexes in `firebase/firestore.indexes.json` are actually deployed to the live project (`firebase deploy --only firestore:indexes`), not just present in the repo.
- Add a `try/catch` around `getProperties()` in `properties/page.tsx` that falls back to an empty result set with a visible message on failure, and add `src/app/properties/error.tsx` plus a root `src/app/error.tsx` as a safety net.

**Acceptance criteria:** `/properties?type=villa` and `/properties?type=penthouse` either show a real, populated category or no longer exist as clickable links anywhere in the app — no dead-end filter values. The properties page never renders a raw crash for any filter combination; worst case is a clean "no listings found" state.

---

## Tier C — Footer, auth, and theming (issues 10, 11, 12)

### 10. Animate the footer "RENTEASE" text on scroll into view

**Problem:** `src/app/page.tsx` (~lines 132–159) already has a GSAP animation on `colossalTextRef` (opacity 0.05→1, scale 0.8→1, y 80→0), but it's configured with `scrub: 1.2` — tightly bound to the scroll distance between "footer top hits viewport bottom" and "footer bottom hits viewport bottom." For a normal-height footer that's a short scroll range, which can make the reveal feel abrupt or jumpy rather than a deliberate slide-up, and it re-runs (partially) any time the user scrolls back and forth across that range rather than playing once.

**Fix:** Change the `ScrollTrigger` config to a one-shot play: remove `scrub`, add `toggleActions: "play none none reverse"` (or `"play none none none"` if it should never reverse), and give the tween a fixed duration (~0.8–1s, ease-out) so it plays as a deliberate slide-up + fade-in the moment the footer enters view, rather than being continuously tied to scroll position.

**Acceptance criteria:** Scrolling down to the footer triggers one smooth slide-up/fade-in of the "RENTEASE" text, independent of how fast or slow the user scrolls through that section.

### 11. Add a logout button

**Problem:** The capability already exists — `signOutUser()` in `src/lib/auth/AuthContext.tsx` (~line 132) clears the server session cookie (`DELETE /api/auth/session`), signs out of Firebase client auth, and clears local `userDoc` state. **Nothing in the UI calls it** — confirmed via search, there are zero references to `signOut`/`logout` anywhere outside `AuthContext.tsx` itself. It also doesn't redirect anywhere after signing out, which the user's own requirement (#11) asks for.

**Fix:**
- Add a visible "Log out" action in the desktop navbar and mobile menu in `src/app/page.tsx` (next to the existing "Dashboard"/"Login" link, visible only when `userDoc` is present), and in `src/components/owner/OwnerSidebar.tsx` / `src/components/admin/AdminSidebar.tsx` for the owner/admin shells.
- On click: call `await signOutUser()`, then redirect via `router.push("/")` (or `/login`) — this redirect needs to be added at the call site or inside `signOutUser()` itself.

**Acceptance criteria:** An authenticated user (tenant, owner, or admin) can find and click a clearly visible logout control from any authenticated page, gets signed out (session cookie cleared, Firebase client signed out), and lands on a public page (not stuck on a page that then errors due to a stale session).

### 12. Light/dark theme toggle — full app-wide

**Problem:** There is currently **no theme system at all**. No `next-themes`, no `dark:` Tailwind variants anywhere in `src/`, no `tailwind.config` (this is Tailwind v4's CSS-first `@theme` block in `src/app/globals.css`). Every component hardcodes literal dark-mode colors directly in `className` strings (`bg-[#050505]`, `bg-[#0a0a0c]`, `text-white`, `border-white/10`, etc.) with no semantic abstraction. Charts (e.g. the revenue bar chart in `AdminDashboardClient.tsx`) are hand-rolled divs/SVG, not a third-party charting library, so no external dark-mode chart config is needed — just consistent token usage.

This was scoped as **full app-wide, in one pass**. Below is the concrete file inventory (38 files currently contain hardcoded color classes) so the agent can track completion:

```
src/app/layout.tsx
src/app/page.tsx
src/app/properties/page.tsx
src/app/properties/[id]/page.tsx
src/app/owner/dashboard/page.tsx
src/app/owner/listings/page.tsx
src/app/owner/properties/new/page.tsx
src/components/hero/HeroCanvasAnimation.tsx
src/components/hero/ScrollTextPanel.tsx
src/components/auth/LoginForm.tsx
src/components/admin/AdminDashboardClient.tsx
src/components/admin/AdminListingsClient.tsx
src/components/admin/AdminModerationClient.tsx
src/components/admin/AdminSidebar.tsx
src/components/owner/ListingWizardClient.tsx
src/components/owner/OwnerAnalyticsClient.tsx
src/components/owner/OwnerCalendarClient.tsx
src/components/owner/OwnerDashboardClient.tsx
src/components/owner/OwnerListingsClient.tsx
src/components/owner/OwnerMessagesClient.tsx
src/components/owner/OwnerSettingsClient.tsx
src/components/owner/OwnerSidebar.tsx
src/components/owner/wizard/Step1Basics.tsx
src/components/owner/wizard/Step2Specs.tsx
src/components/owner/wizard/Step3Location.tsx
src/components/owner/wizard/Step4Media.tsx
src/components/owner/wizard/Step5Publish.tsx
src/components/owner/wizard/WizardSidebar.tsx
src/components/property/FavoriteButton.tsx
src/components/property/ListingControls.tsx
src/components/property/OwnerCard.tsx
src/components/property/PropertyFilters.tsx
src/components/property/PropertyGallery.tsx
src/components/property/PropertyListingGrid.tsx
src/components/property/ReviewsSection.tsx
src/components/property/StarRating.tsx
src/components/ui/BackendNotConfigured.tsx
src/components/ui/Breadcrumb.tsx
```

**Fix:**
1. Add `next-themes` (or an equivalent minimal `ThemeProvider` using `class` strategy) at the root layout (`src/app/layout.tsx`), storing preference in `localStorage` (persists across visits) and defaulting to system preference on first visit.
2. Define **semantic** color tokens for both palettes in `globals.css`'s `@theme` block — e.g. `--color-surface`, `--color-surface-elevated`, `--color-text-primary`, `--color-text-muted`, `--color-border`, `--color-brand-green` (brand green likely stays constant across themes) — each with a light and dark value, switched via the `.dark` class on `<html>`.
3. Systematically replace hardcoded literals (`bg-[#050505]`, `text-white`, `border-white/10`, etc.) across all 38 files above with the semantic tokens, so every page, card, form, menu, sidebar, and dialog resolves color from the same shared set of variables.
4. Add a visible theme toggle control (sun/moon icon button) in the main navbar and in the owner/admin sidebars.
5. Verify contrast in both themes for: the hero cinematic sequence (Tier A) — since it's built around a dark cinematic look, decide whether it stays dark-only regardless of site theme (common pattern for cinematic hero sections) or also adapts; state this decision explicitly in the PR description.

**Acceptance criteria:** Toggling the theme control immediately re-themes the current page with no reload. Navigating to any other route preserves the chosen theme. Refreshing the browser or returning on a later visit preserves the last-chosen theme (`localStorage`, not just `sessionStorage`). All pages — homepage, `/properties`, property detail, login, owner dashboard/listings/calendar/messages/settings/analytics, admin dashboard/listings/moderation, and the property-card expand modal — are legible and correctly styled in both themes, with no leftover hardcoded literal that ignores the active theme (`grep -rn "text-white\|bg-\[#0" src` should return nothing outside of explicitly-dark-only sections, if any are deliberately kept dark per the decision in step 5).

---

## Suggested order of execution

1. **Tier A** (1, 2, 3, 4, 8) — all in the same three hero files, do together.
2. **Tier B** (5, 6, 7, 9) — independent of each other, can be parallelized across files.
3. **Tier C** (10, 11, 12) — do 10 and 11 first (quick, isolated), then 12 last since it's the largest-scope item and benefits from the app being otherwise stable.