#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# install-skills.sh
# Installs Claude Code / Cursor / Antigravity SKILL.md packages for this
# project via the universal `npx skills` CLI (https://skills.sh) plus a
# couple of tool-specific installers.
#
# Run from your PROJECT ROOT so skills land in the project-local skill
# folders (.claude/skills, .agents/skills, etc). Add -g to any `npx skills`
# call to install globally (~/.claude/skills, ~/.cursor/skills, etc) instead,
# so every new project gets them without re-running this script.
#
# A few installers below are Claude-Code-specific CLI commands (`claude
# plugin ...`) or things you paste directly into an agent chat session —
# those are clearly marked. Comment out anything you don't want.
# ---------------------------------------------------------------------------
set -e

echo "======================================================================"
echo " CORE MOTION-DESIGN SKILLS (recommended for every motion project)"
echo "======================================================================"

echo "--> animate-skill: Framer Motion / CSS animation recipes (Next.js/React)"
npx skills add https://github.com/delphi-ai/animate-skill --skill animate

echo "--> design-motion-principles: build+audit motion design, 3-lens critique"
npx skills add kylezantos/design-motion-principles

echo "--> impeccable: full frontend design QA + anti-AI-slop detector + /impeccable animate"
npx impeccable skills install
echo "    (then run '/impeccable init' inside your agent chat once per project)"

echo ""
echo "======================================================================"
echo " EXTRAS — general dev-workflow skills (optional, not motion-specific)"
echo "======================================================================"

echo "--> graphify: turn any folder (code/docs/PDFs/images) into a knowledge graph"
pip install graphifyy --break-system-packages 2>/dev/null || pip install graphifyy
graphify install || echo "    run 'graphify install' manually if this failed"

echo "--> serena: semantic code retrieval/refactoring MCP (needs uv)"
echo "    curl -LsSf https://astral.sh/uv/install.sh | sh   # if uv isn't installed"
uv tool install -p 3.13 serena-agent@latest --prerelease=allow || echo "    install uv first, then rerun this line"
serena init || echo "    run 'serena init' manually after uv tool install completes"

echo "--> claude-mem: persistent memory across Claude Code sessions"
npx claude-mem install

echo "--> obsidian-second-brain: Obsidian vault integration (needs a vault path)"
echo "    curl -fsSL https://raw.githubusercontent.com/eugeniughelbur/obsidian-second-brain/main/scripts/quick-install.sh | bash"

echo "--> one-skill-to-rule-them-all (Task Observer): watches sessions, drafts new skills"
npx skills add rebelytics/one-skill-to-rule-them-all

echo ""
echo "======================================================================"
echo " EXTRAS — run these INSIDE your Claude Code / Cursor chat, not bash"
echo "======================================================================"
cat << 'EOF'

gstack (full CEO/design/QA/ship workflow superagent):
  Paste into Claude Code:
    git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup

ponytail (minimal-code philosophy, "the laziest senior dev"):
  /plugin marketplace add DietrichGebert/ponytail
  /plugin install ponytail@ponytail

superpowers (full TDD/planning/code-review methodology):
  /plugin marketplace add obra/superpowers-marketplace
  /plugin install superpowers@superpowers-marketplace

ai-design-skills (agentic AI product/UX design — NOT visual motion design):
  claude plugin marketplace add Owl-Listener/ai-design-skills
  claude plugin install model-interaction-design@ai-design-skills

devon-claude-skills (PR review automation, image gen, YouTube tools):
  /plugin marketplace add devonjones/devon-claude-skills
  /plugin install pr-review-loop@devon-claude-skills

EOF

echo "Done. See README.md for what each skill does and per-tool install paths"
echo "(Claude Code, Cursor, Antigravity, Claude Desktop)."
