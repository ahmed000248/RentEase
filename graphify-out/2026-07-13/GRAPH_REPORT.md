# Graph Report - D:\New Rentease  (2026-07-13)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 367 nodes · 631 edges · 19 communities (14 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7071fd48`
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
- `Home()` --references--> `lenis`  [EXTRACTED]
  src/app/page.tsx → package.json
- `PropertyDetailPage()` --indirect_call--> `Home()`  [INFERRED]
  src/app/properties/[id]/page.tsx → src/app/page.tsx
- `ExpandedState` --references--> `PropertyDoc`  [EXTRACTED]
  src/components/property/PropertyListingGrid.tsx → src/lib/firebase/types.ts
- `GET()` --calls--> `getCurrentUser()`  [EXTRACTED]
  src/app/api/auth/me/route.ts → src/lib/auth/server.ts
- `POST()` --calls--> `adminDb()`  [EXTRACTED]
  src/app/api/auth/register/route.ts → src/lib/firebase/admin.ts

## Import Cycles
- None detected.

## Communities (19 total, 5 thin omitted)

### Community 0 - "AuthContext.tsx"
Cohesion: 0.10
Nodes (31): metadata, EASE, fieldClass(), friendlyAuthError(), inputClass(), LoginForm(), STATS, FavoriteButton() (+23 more)

### Community 1 - "types.ts"
Cohesion: 0.08
Nodes (32): buildSmoothPath(), EASE, initialsOf(), NAV_ITEMS, NavItem, OwnerDashboardClient(), Props, TYPE_ICON (+24 more)

### Community 2 - "server.ts"
Cohesion: 0.10
Nodes (25): GET(), POST(), VALID_ROLES, POST(), DashboardPage(), metadata, metadata, OwnerListingsPage() (+17 more)

### Community 3 - "WizardContext.tsx"
Cohesion: 0.10
Nodes (25): Props, WizardContent(), Step1Basics(), TYPES, FURNISHING, PREFERRED, Step2Specs(), CITIES (+17 more)

### Community 4 - "dependencies"
Cohesion: 0.06
Nodes (33): animejs, firebase, firebase-admin, framer-motion, gsap, lucide-react, next, dependencies (+25 more)

### Community 5 - "compilerOptions"
Cohesion: 0.06
Nodes (31): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+23 more)

### Community 6 - "devDependencies"
Cohesion: 0.06
Nodes (30): dotenv, eslint, eslint-config-next, devDependencies, dotenv, eslint, eslint-config-next, tsx (+22 more)

### Community 7 - "page.tsx"
Cohesion: 0.14
Nodes (25): OwnerDashboardPage(), AMENITY_ICONS, amenityIcon(), generateMetadata(), PageProps, PropertyDetailPage(), PropertiesPage(), ReviewWithAuthor (+17 more)

### Community 8 - "page.tsx"
Cohesion: 0.09
Nodes (15): metadata, PageProps, ListingControls(), BEDROOM_OPTIONS, FURNISHING_OPTIONS, PREFERRED_FOR_OPTIONS, PropertyFiltersProps, cardVariants (+7 more)

### Community 9 - "layout.tsx"
Cohesion: 0.12
Nodes (14): dancingScript, geistMono, geistSans, hankenGrotesk, inter, jost, metadata, outfit (+6 more)

### Community 10 - "page.tsx"
Cohesion: 0.15
Nodes (10): lenis, lenis, ACCORDIONS, containerVariants, easePremium, FEATURED_PROPERTIES, Home(), itemVariants (+2 more)

### Community 11 - "seed.ts"
Cohesion: 0.38
Nodes (6): app, auth, db, main(), seedProperty(), upsertUser()

### Community 12 - "download.js"
Cohesion: 0.33
Nodes (6): download(), fs, https, path, run(), urls

### Community 13 - "download_stitch.js"
Cohesion: 0.33
Nodes (5): fs, https, outputDir, path, screens

## Knowledge Gaps
- **152 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+147 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `page.tsx`, `devDependencies`?**
  _High betweenness centrality (0.254) - this node is a cross-community bridge._
- **Why does `Home()` connect `page.tsx` to `AuthContext.tsx`, `page.tsx`?**
  _High betweenness centrality (0.242) - this node is a cross-community bridge._
- **Why does `lenis` connect `page.tsx` to `dependencies`?**
  _High betweenness centrality (0.238) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _152 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AuthContext.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10121951219512196 - nodes in this community are weakly interconnected._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08367071524966262 - nodes in this community are weakly interconnected._
- **Should `server.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10384068278805121 - nodes in this community are weakly interconnected._