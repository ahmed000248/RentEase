# Graph Report - New Rentease  (2026-07-13)

## Corpus Check
- 65 files · ~225,097 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 401 nodes · 653 edges · 35 communities (24 shown, 11 thin omitted)
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
- next.config.ts
- postcss.config.mjs
- debug_download.js
- debug_download.js
- Hero Background
- Intro Villa
- Property Apartment
- Sky Background
- Villa Cutout
- page.tsx
- PropertyListingGrid.tsx
- PropertyFilters.tsx
- CLAUDE.md

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

## Communities (35 total, 11 thin omitted)

### Community 0 - "AuthContext.tsx"
Cohesion: 0.10
Nodes (27): GET(), POST(), VALID_ROLES, POST(), DashboardPage(), metadata, OwnerDashboardPage(), metadata (+19 more)

### Community 1 - "types.ts"
Cohesion: 0.06
Nodes (33): animejs, firebase, firebase-admin, framer-motion, gsap, lucide-react, next, dependencies (+25 more)

### Community 2 - "server.ts"
Cohesion: 0.08
Nodes (31): buildSmoothPath(), EASE, initialsOf(), NAV_ITEMS, NavItem, OwnerDashboardClient(), Props, TYPE_ICON (+23 more)

### Community 3 - "WizardContext.tsx"
Cohesion: 0.10
Nodes (31): metadata, EASE, fieldClass(), friendlyAuthError(), inputClass(), LoginForm(), STATS, FavoriteButton() (+23 more)

### Community 4 - "dependencies"
Cohesion: 0.09
Nodes (26): Props, WizardContent(), Step1Basics(), TYPES, FURNISHING, PREFERRED, Step2Specs(), CITIES (+18 more)

### Community 5 - "compilerOptions"
Cohesion: 0.06
Nodes (31): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+23 more)

### Community 6 - "devDependencies"
Cohesion: 0.06
Nodes (30): dotenv, eslint, eslint-config-next, devDependencies, dotenv, eslint, eslint-config-next, tsx (+22 more)

### Community 7 - "page.tsx"
Cohesion: 0.11
Nodes (28): AMENITY_ICONS, amenityIcon(), generateMetadata(), PageProps, PropertyDetailPage(), metadata, PageProps, PropertiesPage() (+20 more)

### Community 8 - "page.tsx"
Cohesion: 0.12
Nodes (14): dancingScript, geistMono, geistSans, hankenGrotesk, inter, jost, metadata, outfit (+6 more)

### Community 9 - "layout.tsx"
Cohesion: 0.20
Nodes (10): Property Penthouse, Property Villa, RentEase Listing Wizard - Basics, RentEase Listing Wizard - Specifications, RentEase Listing Wizard - Location, RentEase Listing Wizard | Media & Amenities, RentEase Listing Wizard | Publish, RentEase Listing Wizard - Basics (Temp) (+2 more)

### Community 10 - "page.tsx"
Cohesion: 0.31
Nodes (9): Publish Listing Action, RentEase Listing Wizard, Amenities Selection, Basics Form, Media Upload, Live Preview Component, RentEase Listing Wizard | Media & Amenities, RentEase Listing Wizard | Publish (+1 more)

### Community 11 - "seed.ts"
Cohesion: 0.38
Nodes (6): app, auth, db, main(), seedProperty(), upsertUser()

### Community 12 - "download.js"
Cohesion: 0.33
Nodes (6): download(), fs, https, path, run(), urls

### Community 13 - "download_stitch.js"
Cohesion: 0.33
Nodes (5): fs, https, outputDir, path, screens

### Community 31 - "page.tsx"
Cohesion: 0.15
Nodes (10): lenis, lenis, ACCORDIONS, containerVariants, easePremium, FEATURED_PROPERTIES, Home(), itemVariants (+2 more)

### Community 32 - "PropertyListingGrid.tsx"
Cohesion: 0.25
Nodes (6): cardVariants, containerVariants, EASE, ExpandedState, PropertyListingGrid(), titleCase()

### Community 33 - "PropertyFilters.tsx"
Cohesion: 0.33
Nodes (4): BEDROOM_OPTIONS, FURNISHING_OPTIONS, PREFERRED_FOR_OPTIONS, PropertyFiltersProps

## Knowledge Gaps
- **167 isolated node(s):** `graphify`, `eslintConfig`, `nextConfig`, `name`, `version` (+162 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `types.ts` to `devDependencies`, `page.tsx`?**
  _High betweenness centrality (0.213) - this node is a cross-community bridge._
- **Why does `Home()` connect `page.tsx` to `WizardContext.tsx`, `page.tsx`?**
  _High betweenness centrality (0.203) - this node is a cross-community bridge._
- **Why does `lenis` connect `page.tsx` to `types.ts`?**
  _High betweenness centrality (0.200) - this node is a cross-community bridge._
- **What connects `graphify`, `eslintConfig`, `nextConfig` to the rest of the system?**
  _167 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AuthContext.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `server.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08392603129445235 - nodes in this community are weakly interconnected._