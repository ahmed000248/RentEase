# Graph Report - New Rentease  (2026-07-13)

## Corpus Check
- 82 files · ~233,378 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 512 nodes · 771 edges · 38 communities (26 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `731d1c38`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AuthContext.tsx
- types.ts
- server.ts
- WizardContext.tsx
- dependencies
- compilerOptions
- devDependencies
- page.tsx
- page.tsx
- layout.tsx
- page.tsx
- seed.ts
- download.js
- download_stitch.js
- layout.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- debug_download.js
- debug_download.js
- file.svg
- globe.svg
- Hero Background
- Intro Villa
- Sky Background
- vercel.svg
- window.svg
- image_urls.txt
- PropertyListingGrid.tsx
- Project Setup Requirements
- proxy.ts
- layout.tsx

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 17 edges
2. `adminDb()` - 16 edges
3. `useWizard()` - 15 edges
4. `getCurrentUser()` - 14 edges
5. `PropertyDoc` - 13 edges
6. `PropertyDetailPage()` - 12 edges
7. `isAdminConfigured()` - 12 edges
8. `UserDoc` - 12 edges
9. `useAuth()` - 11 edges
10. `adminAuth()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `RentEase Listing Wizard - Specifications` --references--> `Property Villa`  [INFERRED]
  scripts/stitch_html/step_2_c82f11d782204e52b2c8aa837c91c2a5.html → public/property_villa.png
- `RentEase Listing Wizard | Publish` --references--> `Property Penthouse`  [INFERRED]
  scripts/stitch_html/step_5_66dd752c189c4b1fb9b21ace58baf21d.html → public/property_penthouse.png
- `RentEase Listing Wizard - Basics` --semantically_similar_to--> `RentEase Listing Wizard - Basics (Temp)`  [EXTRACTED] [semantically similar]
  scripts/stitch_html/step_1_d4ef416162884943aba53f57808bc153.html → temp_stitch/step1.html
- `RentEase Listing Wizard - Specifications` --semantically_similar_to--> `RentEase Listing Wizard - Specifications (Temp)`  [EXTRACTED] [semantically similar]
  scripts/stitch_html/step_2_c82f11d782204e52b2c8aa837c91c2a5.html → temp_stitch/step2.html
- `RentEase Listing Wizard - Location` --semantically_similar_to--> `RentEase Listing Wizard - Location (Temp)`  [EXTRACTED] [semantically similar]
  scripts/stitch_html/step_3_eafc7b9dd4264087881466e423009fd7.html → temp_stitch/step3.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **RentEase Listing Wizard Flow** — scripts_stitch_html_step_1, scripts_stitch_html_step_2, scripts_stitch_html_step_3, scripts_stitch_html_step_4, scripts_stitch_html_step_5 [EXTRACTED 1.00]
- **Project Setup & Automation** — requirements, requirements_update, claude [EXTRACTED 0.90]
- **RentEase Listing Wizard Flow** — temp_stitch_success, temp_stitch_step4, temp_stitch_step5 [EXTRACTED 1.00]

## Communities (38 total, 12 thin omitted)

### Community 0 - "AuthContext.tsx"
Cohesion: 0.10
Nodes (31): metadata, EASE, fieldClass(), friendlyAuthError(), inputClass(), LoginForm(), STATS, FavoriteButton() (+23 more)

### Community 1 - "types.ts"
Cohesion: 0.09
Nodes (39): GET(), POST(), VALID_ROLES, POST(), DashboardPage(), metadata, OwnerDashboardPage(), metadata (+31 more)

### Community 2 - "server.ts"
Cohesion: 0.06
Nodes (43): app, auth, db, main(), seedProperty(), upsertUser(), ACCORDIONS, containerVariants (+35 more)

### Community 3 - "WizardContext.tsx"
Cohesion: 0.09
Nodes (17): metadata, PageProps, PropertiesPage(), ListingControls(), BEDROOM_OPTIONS, FURNISHING_OPTIONS, PREFERRED_FOR_OPTIONS, PropertyFiltersProps (+9 more)

### Community 4 - "dependencies"
Cohesion: 0.09
Nodes (26): Props, WizardContent(), Step1Basics(), TYPES, FURNISHING, PREFERRED, Step2Specs(), CITIES (+18 more)

### Community 5 - "compilerOptions"
Cohesion: 0.06
Nodes (36): animejs, firebase, firebase-admin, framer-motion, gsap, lenis, lucide-react, next (+28 more)

### Community 6 - "devDependencies"
Cohesion: 0.06
Nodes (31): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+23 more)

### Community 7 - "page.tsx"
Cohesion: 0.06
Nodes (30): dotenv, eslint, eslint-config-next, devDependencies, dotenv, eslint, eslint-config-next, tsx (+22 more)

### Community 8 - "page.tsx"
Cohesion: 0.12
Nodes (14): dancingScript, geistMono, geistSans, hankenGrotesk, inter, jost, metadata, outfit (+6 more)

### Community 9 - "layout.tsx"
Cohesion: 0.06
Nodes (22): metadata, metadata, metadata, buildCalendar(), DAYS, EVENTS, OwnerCalendarClient(), TODAY_EVENTS (+14 more)

### Community 10 - "page.tsx"
Cohesion: 0.20
Nodes (10): Property Penthouse, Property Villa, RentEase Listing Wizard - Basics, RentEase Listing Wizard - Specifications, RentEase Listing Wizard - Location, RentEase Listing Wizard | Media & Amenities, RentEase Listing Wizard | Publish, RentEase Listing Wizard - Basics (Temp) (+2 more)

### Community 11 - "seed.ts"
Cohesion: 0.31
Nodes (9): Publish Listing Action, RentEase Listing Wizard, Amenities Selection, Basics Form, Media Upload, Live Preview Component, RentEase Listing Wizard | Media & Amenities, RentEase Listing Wizard | Publish (+1 more)

### Community 12 - "download.js"
Cohesion: 0.06
Nodes (22): metadata, metadata, metadata, ACTIVITY, ASSETS, KPI, KpiCard(), MONTHS (+14 more)

### Community 13 - "download_stitch.js"
Cohesion: 0.12
Nodes (12): metadata, KPI_CARDS, KpiCard, KpiCardComponent(), SPARK_MAX, SPARK_MONTHS, SPARK_VALS, TOP_PROPERTIES (+4 more)

### Community 14 - "layout.tsx"
Cohesion: 0.33
Nodes (6): download(), fs, https, path, run(), urls

### Community 15 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): fs, https, outputDir, path, screens

### Community 16 - "next.config.ts"
Cohesion: 0.18
Nodes (10): Accessibility & Inclusion, Anti-references, Brand Personality, Design Principles, Platform, Positioning, Product, Product Purpose (+2 more)

### Community 22 - "Hero Background"
Cohesion: 0.22
Nodes (8): 1. Confirm the project already has skills installed, 2. Automate the graph update (one-time, do this once), 3. Every time you return to the project (new session, new day, new pages), 4. Adding a new page or feature — per-page checklist, 5. Keep the graph portable across sessions/machines, 6. Periodic full rebuild (only when needed), 7. Confirm before wrapping up a session, Project Update & Automation Requirements

### Community 35 - "Project Setup Requirements"
Cohesion: 0.29
Nodes (6): 1. Install Graphify (codebase knowledge graph), 2. Install Impeccable (frontend design quality skill), 3. Create ignore files (prevents repeated re-scanning of the same folders), 4. Per-page workflow (for each of the Figma design pages), 5. Confirm setup, Project Setup Requirements

### Community 36 - "proxy.ts"
Cohesion: 0.47
Nodes (4): AUTH_ONLY_PREFIXES, config, GUEST_ONLY_PATHS, proxy()

## Knowledge Gaps
- **231 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+226 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `compilerOptions` to `page.tsx`?**
  _High betweenness centrality (0.152) - this node is a cross-community bridge._
- **Why does `Home()` connect `compilerOptions` to `AuthContext.tsx`, `types.ts`, `server.ts`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _231 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AuthContext.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10121951219512196 - nodes in this community are weakly interconnected._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09071117561683599 - nodes in this community are weakly interconnected._
- **Should `server.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.061683599419448475 - nodes in this community are weakly interconnected._
- **Should `WizardContext.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08923076923076922 - nodes in this community are weakly interconnected._