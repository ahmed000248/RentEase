# RentEase — Remediation Plan

This document is a prioritized, actionable punch list for an engineering agent to bring RentEase from "polished mockup" to a functioning rental SaaS. It's derived from a full code review. Work top to bottom — later items assume earlier ones are fixed. Each task lists the problem, why it matters, the concrete fix, files involved, and how to know it's done.

Do not mark anything complete without meeting its acceptance criteria. Do not skip a task because it's inconvenient — the whole point of this doc is that "looks done" and "is done" have been two different things in this codebase.

---

## P0 — Core functionality is fake. Fix before anything else.

### 1. Owner Messages is a static mockup with no backend

**Problem:** `src/components/owner/OwnerMessagesClient.tsx` renders hardcoded `CONVERSATIONS` and `THREAD` arrays. There is no Firestore collection, no send/receive logic, no real-time updates. A headline feature of the product does nothing.

**Fix:**
- Add a `messages` (or `conversations` + `messages` subcollection) schema to `src/lib/firebase/types.ts`, keyed by inquiry or a dedicated conversation id linking `tenantId` + `ownerId` + `propertyId`.
- Add Firestore security rules for the new collection(s) in `firebase/firestore.rules`, following the existing pattern (read/write scoped to participants only, no client-side spoofing of `senderId`).
- Replace the hardcoded arrays with real reads (`onSnapshot` for live updates, or server-fetched + polling if you want to stay simpler) and a real send action that writes to Firestore.
- Wire the compose box to actually persist messages; wire conversation list to real data ordered by latest message.

**Acceptance criteria:** Two different logged-in users (owner + tenant) can exchange a message and see it appear for both, backed by Firestore, with no hardcoded data left in the component.

### 2. Owner Calendar is hardcoded

**Problem:** `src/components/owner/OwnerCalendarClient.tsx` has `TODAY_EVENTS` and `UPCOMING` as literal arrays — not derived from any booking or inquiry data.

**Fix:** Once the booking model exists (see #6), derive calendar events from real reservations/inquiries for the properties the logged-in owner owns. Until the booking system exists, at minimum derive events from real `inquiries` data (scheduled viewings, etc.) instead of invented names and times.

**Acceptance criteria:** Calendar reflects actual Firestore data for the logged-in owner; no literal event arrays remain in the component.

### 3. Admin Moderation and Admin Listings panels do nothing

**Problem:** `src/components/admin/AdminModerationClient.tsx` and `src/components/admin/AdminListingsClient.tsx` have zero imports beyond UI, zero `fetch`/API calls, and hardcoded rows with status badges that aren't wired to any action. The Firestore rules (`firebase/firestore.rules`, `properties` match block) were clearly built around a real pending → approved workflow — admins bypass the owner-locked `status`/`featured` fields — but the UI to drive that workflow doesn't exist.

**Fix:**
- Add API routes (e.g. `src/app/api/admin/properties/[id]/approve/route.ts`, `.../reject/route.ts`, `.../suspend/route.ts`) that call `requireAdmin()` from `src/lib/auth/server.ts`, then update the property's `status` field via `adminDb()`.
- Replace the hardcoded rows in both admin components with real data fetched from Firestore (all properties for Listings; properties with `status === 'pending'` or flagged for Moderation).
- Wire the Approve/Reject/Suspend buttons to actually call the new API routes and refresh the list on success.
- Add a basic moderation audit trail (who approved/rejected what, when) — a `moderationLog` collection or a few fields on the property doc (`moderatedBy`, `moderatedAt`) is enough for v1.

**Acceptance criteria:** An admin can approve a pending property in the UI, and it becomes visible on the public `/properties` page (which already filters on `status == 'approved'`). Rejecting a property removes it from public visibility. No hardcoded rows remain.

### 4. Owner Analytics numbers are fabricated and undisclosed

**Problem:** `buildOwnerAnalytics()` in `src/lib/data/owner.ts` generates revenue/occupancy by hashing the property id (`hashString`) into a pseudo-random number. The function's own comment admits "there's no booking system yet." Owners see a polished revenue chart with completely made-up figures and no indication it isn't real. This is a trust problem, not a cosmetic one.

**Fix — do one of these, not neither:**
- **Preferred:** build the real booking model (#6) and derive analytics from actual reservations/payments.
- **If shipping before that's ready:** keep the simulated data, but make it unmistakably labeled as such in the UI (e.g. a persistent banner: "Demo data — connect a booking system to see real figures") and remove any framing that implies these are real earnings. Do not ship fabricated financial figures to a real owner without disclosure under any circumstance.

**Acceptance criteria:** Either the analytics are real, or the UI makes it impossible for a user to mistake demo numbers for real revenue.

### 5. Mock property fixtures leak into production data paths

**Problem:** `getPropertyById()` and `getProperties`-adjacent code in `src/lib/data/properties.ts`, plus `getPropertiesByOwner()` and the title lookup in `src/lib/data/owner.ts`, splice `MOCK_PROPERTIES` (from `src/lib/data/mockProperties.ts`) directly into real Firestore query results with no environment gate. Fake listings can appear commingled with real user data in production.

**Fix:** Gate all `MOCK_PROPERTIES` usage behind an explicit flag (e.g. `process.env.ENABLE_DEMO_DATA === 'true'`), defaulting to off. In production config, this must be unset/false. Ideally, replace the need for inline mock fallbacks entirely by making `scripts/seed.ts` responsible for seeding a real dev/staging Firestore instance with realistic sample data, and delete the mock-splicing code paths from `properties.ts` and `owner.ts` once seeding covers local dev.

**Acceptance criteria:** `grep -r MOCK_PROPERTIES src/lib/data` returns nothing outside of a clearly-gated demo path (or nothing at all).

### 6. No booking or payment system exists anywhere

**Problem:** This is a rental platform with no reservation flow and no payment integration — no Stripe, no checkout, no booking data model at all. `getInquiriesForOwner` and the inquiry flow are the closest thing to a transaction, but an inquiry is not a booking.

**Fix:**
- Design a `bookings` collection: `propertyId`, `tenantId`, `ownerId`, `startDate`, `endDate`, `status` (`pending_payment` / `confirmed` / `cancelled` / `completed`), `amount`, `paymentIntentId`.
- Add Firestore rules for it mirroring the `inquiries` pattern (tenant and owner can read their own; writes gated server-side).
- Integrate Stripe (Checkout Session or Payment Intents) via a new API route (e.g. `src/app/api/bookings/create/route.ts`) that creates the booking doc and a Stripe session; add a webhook route (`src/app/api/webhooks/stripe/route.ts`) to confirm payment and flip booking status.
- Wire the property detail page's inquiry/contact flow to offer an actual booking-and-pay path, not just a message.

**Acceptance criteria:** A tenant can book a date range on an approved property, pay through Stripe test mode, and the booking shows up as confirmed for both tenant and owner. This unblocks real analytics (#4) and real calendar data (#2).

---

## P1 — Fix before this touches real users or real deployment

### 7. Missing `.env.example`

**Problem:** `src/lib/firebase/admin.ts:58` tells developers to "see .env.example" — the file doesn't exist. Anyone cloning the repo hits a dead end.

**Fix:** Create `.env.example` at the repo root listing every variable actually referenced in code, with placeholder values and a one-line comment each:
```
FIREBASE_SERVICE_ACCOUNT_KEY=       # Full JSON service account key, single-line (see Firebase Console > Project Settings > Service Accounts)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```
Add whatever Stripe env vars #6 introduces once that lands.

**Acceptance criteria:** A new developer can `cp .env.example .env.local`, fill in real values, and run the app with no guesswork.

### 8. Remove the hand-rolled service-account JSON parser

**Problem:** `loadServiceAccount()` in `src/lib/firebase/admin.ts` has a regex-based fallback parser that tries to extract fields out of malformed JSON when `JSON.parse` fails. This solves the wrong problem — it's tolerating broken configuration instead of requiring valid config.

**Fix:** Delete the regex fallback entirely. `loadServiceAccount()` should just `JSON.parse(raw)` and throw a clear, actionable error on failure (e.g. "FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON — copy the full key from the Firebase console without modification"). Document in `.env.example` and the README that the value must be valid single-line JSON (with `\n` escaped in the private key, which Firebase exports correctly by default).

**Acceptance criteria:** `admin.ts` has no regex field-extraction code; invalid JSON produces one clear error, not a silent recovery attempt.

### 9. `getProperties()` scans the whole collection and filters in memory

**Problem:** `src/lib/data/properties.ts` reads the entire `status == 'approved'` collection and filters city/price/bedrooms in JavaScript, despite `firebase/firestore.indexes.json` defining compound indexes on `status`+`createdAt` and `ownerId`+`createdAt` that imply indexed queries were intended.

**Fix:** Rewrite `getProperties()` to build a Firestore query using `.where()` chains for the filters that map cleanly to indexed fields (city, type, bedrooms, price range where feasible), only falling back to in-memory filtering for genuinely un-indexable text search (`searchQuery`). Add pagination (`.limit()` + cursor) instead of pulling the full collection every call.

**Acceptance criteria:** A filtered property search does not read documents outside the matching filter set at the Firestore level (verify via Firestore usage/read-count in the console or emulator).

### 10. No rate limiting on registration

**Problem:** `src/app/api/auth/register/route.ts` has no rate limiting or bot protection. Account creation is trivially spammable.

**Fix:** Add IP-based rate limiting (e.g. Upstash Redis rate limiter, or a simple Firestore-backed counter keyed by IP + time window) to the register and session routes. Consider Firebase App Check for defense in depth.

**Acceptance criteria:** Repeated registration attempts from the same source within a short window are throttled with a 429 response.

---

## P2 — Engineering hygiene

### 11. Zero tests, no CI

**Problem:** No `*.test.*` files anywhere, no `.yml`/`.yaml` CI config, `npm run lint` exists but nothing enforces it.

**Fix:**
- Add Vitest (or Jest) + React Testing Library. Start with the highest-value coverage: Firestore rules tests (`@firebase/rules-unit-testing`) for the security rules, unit tests for `getProperties` filtering logic and `buildOwnerAnalytics`/its replacement, and route tests for the new admin/booking API routes.
- Add `.github/workflows/ci.yml` running `npm run lint`, `tsc --noEmit`, `npm test`, and `npm run build` on every PR.

**Acceptance criteria:** CI runs on push/PR and fails the build on lint, type, or test errors. At minimum the security rules and the new admin approve/reject routes have test coverage.

### 12. Repo bloated with tool scaffolding that should never have been committed

**Problem:** `graphify-out/` (cached AST/semantic JSON, several MB), `stitch-screens/`, `temp_stitch/`, `.antigravityignore`, `.graphifyignore`, `.codex/hooks.json`, `skills-lock.json` are all committed. None of this is the product; it's ~8.6MB of tool-generated cruft.

**Fix:** Delete `graphify-out/`, `stitch-screens/`, `temp_stitch/`, and the tool-specific ignore/config files from the repo. Add them to `.gitignore` going forward (`graphify-out/`, `temp_stitch/`, `.antigravityignore`, `.graphifyignore`). If any HTML in `stitch-screens/` is still a useful design reference, move it to a local-only design folder that isn't committed, not the repo root.

**Acceptance criteria:** `du -sh .` on a fresh clone is a small fraction of the current 8.6MB, and `git status` shows no tool-scaffolding files tracked.

### 13. No README, docs scattered

**Problem:** `PRODUCT.md`, `REQUIREMENTS.md`, `REQUIREMENTS-UPDATE.md`, and `CLAUDE.md` exist; there's no `README.md`. Anyone landing on the repo has no setup/run instructions.

**Fix:** Add a `README.md` at the root covering: what the project is (one paragraph), tech stack, prerequisites, setup steps (`.env.local` from `.env.example`, Firebase project setup, `npm install`, `npm run db:seed`, `npm run dev`), how to run tests once #11 lands, and a short pointer to `PRODUCT.md`/`REQUIREMENTS.md` for product context.

**Acceptance criteria:** A developer with zero prior context can go from `git clone` to a running local instance using only the README.

### 14. Single commit, no history

**Problem:** The entire repo is one commit. No incremental history, no PR trail.

**Fix:** This is a process fix, not a code fix — going forward, work in small, reviewable commits/PRs with descriptive messages, and use CI (#11) as a merge gate. Nothing to do retroactively to the existing history, but flag this as a required change in how work happens from here.

**Acceptance criteria:** From this point forward, no more single-commit feature dumps; PRs are reviewable in reasonably sized increments.

---

## P3 — Polish, once the above is real

### 15. Animation/3D dependency bloat

**Problem:** `package.json` pulls in `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`, `gsap`, `animejs`, and `lenis` simultaneously — five-plus overlapping animation systems for a CRUD listings app, at real cost to bundle size and load time.

**Fix:** Audit actual usage of each library across `src/`. Consolidate to at most one general-purpose animation library (Framer Motion is likely sufficient for most of this UI) plus Three.js only if there's a specific 3D element that justifies it. Remove the rest and their imports.

**Acceptance criteria:** `package.json` dependencies reflect only libraries with real, non-overlapping usage; run a bundle analyzer before/after to confirm a measurable reduction.

---

## Suggested order of execution

1. P0 items 1–6 (in order; #6 unblocks real versions of #2 and #4)
2. P1 items 7–10
3. P2 items 11–14
4. P3 item 15

Do not reorder P0 above P1, or polish (P3) above functionality (P0) — that's the mistake that produced this codebase in the first place.
