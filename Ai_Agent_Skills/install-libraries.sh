#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# install-libraries.sh
# Core 2D/3D motion stack for a React/Next.js project.
# Run this from the ROOT of your project (after `npx create-next-app` or
# equivalent). Safe to re-run.
#
# Usage:
#   ./install-libraries.sh          # uses npm
#   PM=pnpm ./install-libraries.sh  # uses pnpm
#   PM=yarn ./install-libraries.sh  # uses yarn
# ---------------------------------------------------------------------------
set -e

PM=${PM:-npm}

echo ""
echo "==> Installing core 2D/3D motion libraries with $PM"
echo ""

case "$PM" in
  npm)
    npm install gsap framer-motion three @react-three/fiber @react-three/drei lenis animejs
    npm install -D @types/three
    ;;
  pnpm)
    pnpm add gsap framer-motion three @react-three/fiber @react-three/drei lenis animejs
    pnpm add -D @types/three
    ;;
  yarn)
    yarn add gsap framer-motion three @react-three/fiber @react-three/drei lenis animejs
    yarn add -D @types/three
    ;;
  *)
    echo "Unknown package manager: $PM (try: PM=pnpm ./install-libraries.sh)"
    exit 1
    ;;
esac

cat << 'EOF'

Installed:
  gsap                   - timeline-based animation engine (ScrollTrigger, etc.)
  framer-motion (motion) - declarative React animation, layout/shared-layout transitions
  three                  - WebGL 3D engine
  @react-three/fiber     - React renderer for three.js
  @react-three/drei      - helpers/abstractions for react-three-fiber
  lenis                  - buttery smooth scroll, pairs with GSAP ScrollTrigger
  animejs                - lightweight, dependency-free animation library

Next:
  ./install-ui-components.sh   pulls in animated UI blocks (KokonutUI, Skiper UI, etc.)
  ./install-skills.sh          wires up the Claude Code / Cursor / Antigravity skills
EOF
