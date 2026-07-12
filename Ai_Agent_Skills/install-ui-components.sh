#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# install-ui-components.sh
# Pulls a starter set of animated components from the shadcn-based registries
# into your project via the shadcn CLI. These copy source into your repo
# (you own the code), they are not npm runtime dependencies.
#
# Requires shadcn/ui already initialised in the project:
#   npx shadcn@latest init
#
# Each registry has far more components than listed here — browse the sites
# and swap in `npx shadcn add @<registry>/<component-name>` for whatever you
# need. This script just seeds a few good motion-heavy starting points.
# ---------------------------------------------------------------------------
set -e

echo "==> KokonutUI (100+ Tailwind + Motion components) — https://kokonutui.com"
npx shadcn@latest add @kokonutui/action-search-bar || true
npx shadcn@latest add @kokonutui/card-flip || true
# Browse more:   https://kokonutui.com/docs/components/action-search-bar
# Install any:   npx shadcn@latest add @kokonutui/<component-name>

echo ""
echo "==> Skiper UI (100+ 'uncommon' animated shadcn components, Motion.dev-based)"
echo "    https://skiper-ui.com"
npx shadcn add @skiper-ui/skiper40 || true
# Browse more:   https://www.skiper-ui.com/components
# Install any:   npx shadcn add @skiper-ui/<component-name>
# Note: some Skiper components are premium (one-time payment, no subscription).

echo ""
echo "==> React Bits (animated React components/backgrounds/text effects)"
echo "    https://reactbits.dev — browse the site and copy the CLI command"
echo "    shown per-component, e.g.:"
echo "    npx shadcn@latest add https://reactbits.dev/r/<component-name>.json"

echo ""
echo "==> cult/ui (optional — free + Pro animated blocks, Framer Motion based)"
echo "    https://cult-ui.com/docs — mostly pivoted toward AI SDK agent UI blocks now,"
echo "    but still useful for motion primitives. Install per-component:"
echo "    npx shadcn@latest add https://cult-ui.com/r/<component-name>.json"

echo ""
echo "Done. Components were copied into your components/ui (or similar) folder — edit freely."
