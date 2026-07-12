# Motion Stack Toolkit

A drop-in folder for 2D/3D motion websites. Copy this folder into any new
frontend project, run three scripts, and every animation library, animated
component kit, and Claude/Cursor/Antigravity skill you use is installed —
no more re-finding and re-installing the same tools per project.

## Quick start

```bash
# 1. Copy this folder into your new project's root
cp -r motion-stack-toolkit /path/to/new-project/
cd /path/to/new-project/motion-stack-toolkit

# 2. Core animation libraries (GSAP, Framer Motion, Three.js, Lenis, anime.js)
./install-libraries.sh

# 3. Animated UI component kits (KokonutUI, Skiper UI, React Bits, cult/ui)
./install-ui-components.sh

# 4. Claude Code / Cursor / Antigravity skills (motion + general dev)
./install-skills.sh
```

Requires a shadcn-initialised React/Next.js project for step 3
(`npx shadcn@latest init`) and Node.js + `uv` + `pip` on your machine for
some skill installers in step 4.

---

## 1. Core 2D/3D Motion Libraries

Installed by `install-libraries.sh` (`npm install ...`, or `PM=pnpm`/`PM=yarn`).

| Package | What it's for |
|---|---|
| `gsap` | Industry-standard timeline animation engine. ScrollTrigger plugin drives most scroll-based motion sites. |
| `framer-motion` (import as `motion`) | Declarative React animation: enter/exit, shared-layout (`layoutId`) morphs, gestures, `AnimatePresence`. |
| `three` | The underlying WebGL 3D engine. |
| `@react-three/fiber` | React renderer for three.js — write 3D scenes as JSX components. |
| `@react-three/drei` | Ready-made helpers for `@react-three/fiber` (camera controls, loaders, text, environments). |
| `lenis` | Buttery-smooth inertia scrolling; pairs with GSAP ScrollTrigger for scroll-driven motion. |
| `animejs` | Lightweight, dependency-free animation engine — good for simpler SVG/DOM animation without React. |
| `react`, `next.js`, `tailwindcss` | Base framework/styling — assumed already scaffolded (`npx create-next-app`). |

## 2. Animated UI Component Kits

Installed by `install-ui-components.sh` via the shadcn CLI (components are
copied into your repo as source, not npm dependencies — you own and can
edit the code).

| Kit | Install | Notes |
|---|---|---|
| **KokonutUI** | `npx shadcn@latest add @kokonutui/<name>` | 100+ free, open-source components built with Next.js/React/Tailwind/Motion. Browse: kokonutui.com |
| **Skiper UI** | `npx shadcn add @skiper-ui/<name>` | 100+ "uncommon" animated components on Motion.dev; some are premium (one-time payment). Browse: skiper-ui.com |
| **React Bits** | `npx shadcn@latest add https://reactbits.dev/r/<name>.json` | Animated backgrounds, text effects, and React components. Browse: reactbits.dev |
| **cult/ui** | `npx shadcn@latest add https://cult-ui.com/r/<name>.json` | Free + Pro animated blocks (Framer Motion based). The project has leaned into AI SDK agent UI lately, but the original animated primitives are still there. |

`bklit.com` (chart/data-viz components) was in your original list but is
about data visualization, not motion/animation, so it's left out of this
toolkit — add it separately if you need charts.

## 3. Motion & Design Skills (Claude Code / Cursor / Antigravity)

These are `SKILL.md` packages that make your AI coding agent apply good
motion-design judgment automatically — instead of generating the generic
"fade-in-on-scroll, bounce-on-hover" look every model defaults to.

| Skill | What it does | Install |
|---|---|---|
| **animate-skill** (delphi-ai) | Animation patterns/recipes for Next.js/React based on Emil Kowalski's course. 8 worked examples (hover, toasts, modals, shared-layout morphs, height changes). Triggers automatically on animation requests, or call `/animate`. | `npx skills add https://github.com/delphi-ai/animate-skill --skill animate` |
| **design-motion-principles** (kylezantos) | Two modes: **build** components with purposeful motion, or **audit** existing motion against an anti-AI-slop checklist (pulsing indicators, hover-scale-everything, stagger-spam). Weighs three real designers' philosophies (Emil Kowalski's restraint, Jakub Krehel's polish, Jhey Tompkins's playfulness) against your project's context. | `npx skills add kylezantos/design-motion-principles` |
| **impeccable** (pbakaus) | Broader frontend design QA skill with 23 commands (`/impeccable animate`, `polish`, `critique`, `audit`...), a live browser iteration mode, and 41 deterministic detector rules for AI-generated design tells (bounce easing, purple gradients, cards-in-cards). | `npx impeccable skills install` then `/impeccable init` |

All three work with Claude Code, Cursor, and Antigravity (the `npx skills`
and `npx impeccable skills install` CLIs auto-detect installed agents and
write to the right skill folder for each).

## 4. Extras — General Dev-Workflow Skills

Not motion-specific, but part of your original list and useful across any
project. Included per your choice to bundle both buckets in one folder.

| Skill/Tool | What it does | Install |
|---|---|---|
| **gstack** (garrytan) | Turns Claude Code into a full virtual eng team: `/office-hours` (spec out ideas), `/plan-eng-review`, `/design-shotgun` (AI mockup variants), `/review`, `/qa` (real browser testing), `/ship`, `/cso` (security audit), and more. Heavyweight, opinionated, very complete. | Paste into Claude Code chat: `git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup` |
| **graphify** | Turns any folder (code, PDFs, markdown, screenshots, whiteboard photos) into an interactive, queryable knowledge graph. `/graphify .` | `pip install graphifyy && graphify install` |
| **serena** (oraios) | Semantic code retrieval/refactoring MCP server — IDE-level symbol search, rename, find-references, in large codebases. General coding, not motion-specific. | `uv tool install -p 3.13 serena-agent@latest --prerelease=allow` then `serena init` |
| **ponytail** (DietrichGebert) | Minimal-code philosophy: checks YAGNI → stdlib → native feature → existing dependency → one-liner, before letting the agent write custom code. | In Claude Code: `/plugin marketplace add DietrichGebert/ponytail` then `/plugin install ponytail@ponytail` |
| **claude-mem** (thedotmack) | Persistent memory across Claude Code sessions — no more re-explaining project context every session. | `npx claude-mem install` |
| **obsidian-second-brain** (eugeniughelbur) | 33 commands connecting Claude Code to an Obsidian vault: auto-saves decisions/tasks/people, ingests URLs/PDFs/audio, nightly self-reconciling vault. | `curl -fsSL https://raw.githubusercontent.com/eugeniughelbur/obsidian-second-brain/main/scripts/quick-install.sh \| bash` |
| **superpowers** (obra) | Full TDD + planning + subagent-driven-development methodology: brainstorm → plan → red/green TDD → code review → ship. | In Claude Code: `/plugin marketplace add obra/superpowers-marketplace` then `/plugin install superpowers@superpowers-marketplace` |
| **one-skill-to-rule-them-all / Task Observer** (rebelytics) | Meta-skill that watches your sessions and drafts new skills / improves existing ones based on corrections you make. | `npx skills add rebelytics/one-skill-to-rule-them-all` |
| **ai-design-skills** (Owl-Listener) | 42 skills / 6 plugins for designing *AI agent* products (interaction patterns, alignment, evaluation, orchestration). Despite the name, this is about agentic UX, not visual/motion design — kept here for completeness since you linked it. | `claude plugin marketplace add Owl-Listener/ai-design-skills` then `claude plugin install model-interaction-design@ai-design-skills` |
| **devon-claude-skills** (devonjones) | Grab-bag marketplace: PR review-loop automation, AI image generation (nano-banana), YouTube transcript/screenshot/synthesis tools. | In Claude Code: `/plugin marketplace add devonjones/devon-claude-skills` then `/plugin install pr-review-loop@devon-claude-skills` |

Not included (checked, not a fit): `manus.im` (general AI app builder, unrelated
product), `WatermelonCorp/watermelon-platform` (someone else's component-registry
website source code, not an installable package), `bklit.com` (charts/data-viz,
not motion).

---

## Per-tool setup notes

**Claude Code** — skills land in `.claude/skills/` (project) or `~/.claude/skills/`
(global, all projects). Plugins (the `/plugin marketplace add` ones) are managed
separately via `/plugin` commands inside a Claude Code session.

**Cursor** — skills land in `.agents/skills/` (project) or `~/.cursor/skills/`
(global). Requires Cursor Nightly channel with Agent Skills enabled
(Settings → Beta / Settings → Rules).

**Antigravity** (Google) — skills land in `.agents/skills/` (project) or
`~/.gemini/antigravity/skills/` (global). Supported directly by the `npx skills`
and `npx impeccable skills install` CLIs used above.

**Claude Desktop / claude.ai (Cowork)** — no project directory; skills are
uploaded as a zipped `SKILL.md` folder via Settings → Capabilities → Skills.
For `one-skill-to-rule-them-all`, Cowork gets the full filesystem experience;
plain claude.ai chat gets a "handoff document" mode instead.

---

## Folder contents

```
motion-stack-toolkit/
├── README.md                  <- this file
├── install-libraries.sh       <- npm/pnpm/yarn: gsap, framer-motion, three, r3f, drei, lenis, animejs
├── install-ui-components.sh   <- shadcn CLI: KokonutUI, Skiper UI, React Bits, cult/ui
└── install-skills.sh          <- npx skills / plugin installers for section 3 & 4 above
```

## Updating

Re-run any script any time — installers are idempotent (`npm install` skips
existing deps, `npx skills add` and `npx skills update` handle re-installs).
For skills installed globally (`-g` flag), every new project gets them
automatically without needing this folder at all; project-local installs
(the default here) keep the toolkit self-contained and are easiest to hand
to teammates.
