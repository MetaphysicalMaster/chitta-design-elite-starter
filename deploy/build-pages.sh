#!/usr/bin/env bash
# Build each client mockup as a standalone GitHub Pages static site.
# Each output folder is self-contained: the client's homepage at root (/),
# the _next asset bundle, a .nojekyll (so Pages serves the _next dir), and a
# README. Mirrors the Pure Silk flow (static files -> repo -> GitHub Pages).
#
# Usage:  bash deploy/build-pages.sh
# Output: deploy/<repo-slug>/  (one per client)
set -euo pipefail
cd "$(dirname "$0")/.."

# slug(repo name) | route under /mockups | display name
CLIENTS=(
  "blue-sky-rebrand|blue-sky|Blue Sky Med Spa"
  "encore-rebrand|encore|Encore Dermatology"
  "beyond-skin-rebrand|beyond-skin|Beyond Skin Aesthetics"
  "the-luxe-rebrand|the-luxe|The Luxe MedSpa"
)

for entry in "${CLIENTS[@]}"; do
  IFS="|" read -r slug route name <<< "$entry"
  echo "==> Building $name  ->  deploy/$slug  (basePath /$slug)"
  rm -rf out "deploy/$slug"
  DEPLOY_EXPORT=1 DEPLOY_BASEPATH="/$slug" npx next build >/dev/null 2>&1

  dest="deploy/$slug"
  mkdir -p "$dest"
  cp out/mockups/"$route"/index.html "$dest/index.html"
  cp -r out/_next "$dest/_next"
  cp out/404.html "$dest/404.html" 2>/dev/null || true
  # root static assets the pages may reference
  cp out/favicon.ico "$dest/" 2>/dev/null || true
  touch "$dest/.nojekyll"
  cat > "$dest/README.md" <<EOF
# ${name} — Homepage Rebrand (Owner Preview)

Proposed homepage rebuild for **${name}** (Columbus, OH metro), by CHITTA DesignGod.

- **Live preview:** https://metaphysicalmaster.github.io/${slug}/ (after GitHub Pages is enabled)
- **Status:** Mockup v1 — owner preview phase
- **Tech:** Next.js static export · Three.js / React Three Fiber power-element hero · Tailwind v4 · Framer Motion
- Self-contained static site (\`.nojekyll\` keeps the \`_next/\` asset dir intact on Pages).

> Built as a pitch preview. Sample/placeholder imagery is marked as such.
EOF
  pages=$(find "$dest" -name '*.html' | wc -l | tr -d ' ')
  size=$(du -sh "$dest" | cut -f1)
  echo "    packaged: $size, $pages html file(s)"
done

rm -rf out
echo "Done. Ship each with:  cd deploy/<slug> && gh repo create MetaphysicalMaster/<slug> --public --source=. --remote=origin --push"
