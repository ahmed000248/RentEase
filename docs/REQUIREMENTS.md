# Project Setup Requirements

> Read this file fully, then run every step below in order. Skip nothing.
> Goal: install the two AI-agent skills this project needs (Graphify + Impeccable),
> configure ignore files so folders aren't re-scanned on every prompt, and set up
> design context for building Figma-based frontend pages.

---

## 1. Install Graphify (codebase knowledge graph)

Run in terminal:

```bash
uv tool install graphifyy
```

If `uv` is not installed:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Then register the skill for this tool/IDE, scoped to this project:

```bash
graphify install --project
```

(For Google Antigravity specifically: `graphify antigravity install --project`)

Build the initial graph for this project:

```bash
/graphify .
```

This creates `graphify-out/` (graph.json, graph.html, GRAPH_REPORT.md). From now on,
consult `graphify query "<question>"` for codebase questions instead of re-reading
or re-scanning all project files.

---

## 2. Install Impeccable (frontend design quality skill)

Run in terminal:

```bash
npx impeccable install --project
```

Then initialize design context (this project is a **product/app UI**, not a
marketing/brand site):

```bash
/impeccable init
```

Answer the setup prompts based on this project's audience, colors, typography,
and components (from the Figma design files provided).

---

## 3. Create ignore files (prevents repeated re-scanning of the same folders)

Create `.antigravityignore` (or the equivalent ignore file for whatever agent/IDE
is being used) at the project root with:

```
node_modules/
dist/
build/
.next/
coverage/
*.log
graphify-out/cost.json
.impeccable/*.png
.impeccable/live/
```

Create `.graphifyignore` at the project root with:

```
node_modules/
dist/
*.generated.*
```

Reload the IDE/agent window after creating these files so the ignore rules take effect.

---

## 4. Per-page workflow (for each of the Figma design pages)

For every page being built from the design files, run in this order:

1. `/impeccable shape` — plan the UX/UI before writing code
2. Build the page
3. `/impeccable audit <page>` — check accessibility, performance, responsiveness
4. `/impeccable polish <page>` — final design-system alignment pass

Use `graphify query "..."` any time you need to understand how existing
components/files connect, instead of re-reading the whole project.

---

## 5. Confirm setup

Before starting page-by-page work, confirm:

- [ ] `graphify-out/graph.json` exists
- [ ] `PRODUCT.md` (and optionally `DESIGN.md`) exist from `/impeccable init`
- [ ] `.antigravityignore` and `.graphifyignore` exist at project root
- [ ] IDE/agent window has been reloaded

Once all boxes are checked, proceed to build the pages using the per-page workflow above.
