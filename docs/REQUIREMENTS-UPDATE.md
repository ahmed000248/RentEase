# Project Update & Automation Requirements

> Use this file for ongoing work on a project that already has Graphify + Impeccable
> installed (see REQUIREMENTS.md for initial setup). This covers what to do every
> time you come back to add pages, features, or make changes — without re-scanning
> the whole project from scratch.

---

## 1. Confirm the project already has skills installed

Before doing anything, check that these exist at the project root:

- [ ] `graphify-out/graph.json` (Graphify's saved knowledge graph)
- [ ] `.antigravityignore` and `.graphifyignore`
- [ ] `PRODUCT.md` (from Impeccable's `/impeccable init`)

If any are missing, run REQUIREMENTS.md first — this file assumes setup is already done.

---

## 2. Automate the graph update (one-time, do this once)

Set up the git hook so the graph updates itself after every commit, instead of
manually re-running it:

```bash
graphify hook install
```

This rebuilds the graph incrementally (AST-only, no LLM cost, no tokens spent)
after each commit — only new/changed files are processed, never the whole project.

Confirm it's active any time with:

```bash
graphify hook status
```

---

## 3. Every time you return to the project (new session, new day, new pages)

**Do NOT run `/graphify .` again.** That's a full rebuild and unnecessary.

Instead, run:

```bash
/graphify . --update
```

This re-extracts only new or changed files (e.g. a new page you just added) and
leaves everything already mapped untouched.

If you've set up the git hook from Step 2, this may already be handled automatically
on your last commit — check `graphify-out/graph.json`'s timestamp before manually
running `--update`.

---

## 4. Adding a new page or feature — per-page checklist

Repeat this for each new page/feature added in a session:

1. `/impeccable shape` — plan the UX/UI before writing code
2. Build the page/feature
3. `/impeccable audit <page>` — accessibility, performance, responsiveness check
4. `/impeccable polish <page>` — final design-system alignment pass
5. Commit the change (`git commit`) — triggers the incremental graph update if the hook is installed

Use `graphify query "<question>"` any time you need to understand how a new page
connects to existing components — don't ask the agent to re-read the whole project.

---

## 5. Keep the graph portable across sessions/machines

- Commit `graphify-out/graph.json` to git — this is what makes the graph persist
  across time, computers, and long breaks between sessions.
- Do NOT commit `graphify-out/cost.json` (already in `.antigravityignore` from setup) — this is local-only.
- If working across multiple machines, pull the latest commit first so your local
  graph matches the project's current state before running `--update`.

---

## 6. Periodic full rebuild (only when needed)

A full `/graphify .` rebuild (not `--update`) is only needed if:

- The graph seems out of sync or is missing recently added pages/components
- You did a large refactor that renamed/moved many files at once
- You see "ghost duplicate" node warnings in the graph report

Otherwise, always prefer `--update` over a full rebuild.

---

## 7. Confirm before wrapping up a session

- [ ] Latest changes committed to git
- [ ] Graph updated (`--update` ran, or hook triggered it automatically)
- [ ] `/impeccable audit` and `/impeccable polish` run on any new/changed pages
- [ ] No leftover `.impeccable/` screenshots or temp files accidentally committed
