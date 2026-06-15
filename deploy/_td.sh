#!/usr/bin/env bash
set -euo pipefail
export MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL='*'
cd "$(dirname "$0")/.."
CLIENTS=("timeless-rebrand|timeless|Timeless Aesthetics MedSpa" "darst-rebrand|darst|Darst Dermatology")
for entry in "${CLIENTS[@]}"; do
  IFS="|" read -r slug route name <<< "$entry"
  echo "==> $name -> deploy/$slug"
  rm -rf out "deploy/$slug"
  DEPLOY_EXPORT=1 DEPLOY_BASEPATH="/$slug" npx next build > "deploy/_b_$slug.log" 2>&1
  dest="deploy/$slug"; mkdir -p "$dest/_next/static/media"
  cp out/mockups/"$route"/index.html "$dest/index.html"
  cp out/404.html "$dest/404.html" 2>/dev/null || true
  cp out/favicon.ico "$dest/" 2>/dev/null || true
  touch "$dest/.nojekyll"
  printf '# %s\nLive: https://metaphysicalmaster.github.io/%s/\n' "$name" "$slug" > "$dest/README.md"
  cp -r out/_next/static/chunks "$dest/_next/static/chunks"
  for d in out/_next/static/*/; do [ -f "$d/_buildManifest.js" ] && cp -r "$d" "$dest/_next/static/"; done
  cssf=$(grep -oE "_next/static/chunks/[A-Za-z0-9_.~-]+\.css" "$dest/index.html" | sed 's#_next/static/##' | sort -u || true)
  { grep -oE "media/[A-Za-z0-9_.~-]+\.(woff2|woff|ttf|otf)" "$dest/index.html" || true; for c in $cssf; do grep -oE "media/[A-Za-z0-9_.~-]+\.(woff2|woff|ttf|otf)" "out/_next/static/$c" 2>/dev/null || true; done; } | sed 's#media/##' | sort -u | while read -r f; do [ -n "$f" ] && cp "out/_next/static/media/$f" "$dest/_next/static/media/$f" 2>/dev/null || true; done
  if [ -d "out/clients/$route" ]; then
    mkdir -p "$dest/clients"; cp -r "out/clients/$route" "$dest/clients/$route"
    grep -rl "/clients/" "$dest/index.html" "$dest/_next" 2>/dev/null | while read -r f; do sed -i "s#/clients/#/$slug/clients/#g" "$f"; done
  fi
  echo "    packaged: $(du -sh "$dest" | cut -f1)"
  ( cd "$dest"; rm -rf .git; git init -q -b main; git add -A
    git -c user.email=noreply@anthropic.com -c user.name=Claude commit -q -m "Deploy ${slug}: real doctor photos + card/treatment imagery filled"
    git remote add origin "https://github.com/MetaphysicalMaster/${slug}.git"
    git push -f -u origin main >/tmp/push_$slug.log 2>&1; echo "    push exit: $?" )
done
rm -rf out; rm -f deploy/_b_*.log
echo "TD REDEPLOY DONE"
