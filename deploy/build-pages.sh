#!/usr/bin/env bash
# Build each client mockup as a standalone, SLIMMED GitHub Pages static site.
# Each output folder = the client's homepage at root + a .nojekyll + only the
# JS/CSS chunks (all, so the lazy-loaded WebGL chunk is included) and only THAT
# route's fonts (next/font media) — keeping bundles ~6MB instead of ~31MB (the
# full export bundles every brand's fonts). Mirrors the Pure Silk flow
# (static files -> repo -> GitHub Pages).
#
# Usage:  bash deploy/build-pages.sh
# Output: deploy/<repo-slug>/  (one per client)
set -euo pipefail
cd "$(dirname "$0")/.."

# repo-slug | route under /mockups | display name
CLIENTS=(
  "blue-sky-rebrand|blue-sky|Blue Sky Med Spa"
  "encore-rebrand|encore|Encore Dermatology"
  "beyond-skin-rebrand|beyond-skin|Beyond Skin Aesthetics"
  "the-luxe-rebrand|the-luxe|The Luxe MedSpa"
  "avail-rebrand|avail|Avail Aesthetics"
  "happy-clinic-rebrand|happy-clinic|Happy Clinic Denver"
  "simplyskin-rebrand|simplyskin|SimplySkin MedSpa"
  "timeless-rebrand|timeless|Timeless Aesthetics MedSpa"
  "hanami-rebrand|hanami|Hanami Medspa"
  "sousan-rebrand|sousan|Sousan Med Spa"
  "darst-rebrand|darst|Darst Dermatology"
  "beautox-bar-rebrand|beautox-bar|Beautox Bar"
  "karma-rebrand|karma|Karma Beauty & Wellness"
  "eternity-rebrand|eternity|Eternity Med Spa"
)

for entry in "${CLIENTS[@]}"; do
  IFS="|" read -r slug route name <<< "$entry"
  echo "==> $name  ->  deploy/$slug  (basePath /$slug)"
  rm -rf out "deploy/$slug"
  DEPLOY_EXPORT=1 DEPLOY_BASEPATH="/$slug" npx next build >/dev/null 2>&1
  dest="deploy/$slug"
  mkdir -p "$dest/_next/static/media"
  cp out/mockups/"$route"/index.html "$dest/index.html"
  cp out/404.html "$dest/404.html" 2>/dev/null || true
  cp out/favicon.ico "$dest/" 2>/dev/null || true
  touch "$dest/.nojekyll"
  cat > "$dest/README.md" <<EOF
# ${name} — Homepage Rebrand (Owner Preview)

Proposed homepage rebuild by CHITTA DesignGod.
- **Live preview:** https://metaphysicalmaster.github.io/${slug}/
- **Tech:** Next.js static export · Three.js / React Three Fiber power-element hero · Tailwind v4 · Framer Motion
- Self-contained static site (\`.nojekyll\` keeps the \`_next/\` dir intact on Pages). Sample imagery marked as such.
EOF
  # all chunks (keeps the dynamic WebGL chunk) + the build-id manifest dir
  cp -r out/_next/static/chunks "$dest/_next/static/chunks"
  for d in out/_next/static/*/; do [ -f "$d/_buildManifest.js" ] && cp -r "$d" "$dest/_next/static/"; done
  # only THIS route's fonts (from its css + html preloads) — strict pattern avoids escaped-quote artifacts
  cssf=$(grep -oE "_next/static/chunks/[A-Za-z0-9_.~-]+\.css" "$dest/index.html" | sed 's#_next/static/##' | sort -u || true)
  { grep -oE "media/[A-Za-z0-9_.~-]+\.(woff2|woff|ttf|otf)" "$dest/index.html" || true;
    for c in $cssf; do grep -oE "media/[A-Za-z0-9_.~-]+\.(woff2|woff|ttf|otf)" "out/_next/static/$c" 2>/dev/null || true; done; } \
    | sed 's#media/##' | sort -u | while read -r f; do [ -n "$f" ] && cp "out/_next/static/media/$f" "$dest/_next/static/media/$f" 2>/dev/null || true; done
  # this client's REAL images (public/clients/<route>) + basePath-prefix every
  # root-absolute /clients/ reference. next/image AND raw <img> emit /clients/...
  # with NO basePath, which 404s on a Pages project site served under /<slug>/.
  if [ -d "out/clients/$route" ]; then
    mkdir -p "$dest/clients"
    cp -r "out/clients/$route" "$dest/clients/$route"
    grep -rl "/clients/" "$dest/index.html" "$dest/_next" 2>/dev/null | while read -r f; do
      sed -i "s#/clients/#/$slug/clients/#g" "$f"
    done
    echo "    + clients/$route ($(du -sh "$dest/clients/$route" | cut -f1)) basePath-fixed"
  fi
  echo "    packaged: $(du -sh "$dest" | cut -f1)"
done

rm -rf out
echo "Done. Ship each with:  cd deploy/<slug> && gh repo create MetaphysicalMaster/<slug> --public --source=. --remote=origin --push"
