#!/usr/bin/env bash
# Build a plain-HTML export of the marketing site, for shared hosting with no
# Node.js (hunarsaaz.pk). The learning portal is not part of it: /learn, /admin
# and /cms-api need a running server and a database, so they are set aside for
# the duration of the build and restored afterwards. The portal is deployed
# separately as a Node build — see README "Learning portal".
set -euo pipefail
cd "$(dirname "$0")/.."

# Route trees that cannot exist in an export build, and where each is parked.
# The stash lives outside src/app so Next does not pick it up mid-build.
STASH=.static-build-stash
declare -A PARKED=(
  ["src/app/api"]="$STASH/api"                       # form handlers (POST)
  ["src/app/(payload)"]="$STASH/payload"             # /admin and /cms-api
  ["src/app/(frontend)/learn"]="$STASH/learn"        # the portal itself
  ["src/app/(frontend)/verify"]="$STASH/verify"      # reads certificates from the DB
)

# robots.ts and sitemap.ts read SITE_URL per request on the Node build, which
# an export has no way to do — Next rejects "force-dynamic" outright here. The
# value has to be a literal, so rewrite it for the build and put it back after.
META_ROUTES=(src/app/robots.ts src/app/sitemap.ts)

restore() {
  for src in "${!PARKED[@]}"; do
    [ -d "${PARKED[$src]}" ] && mv "${PARKED[$src]}" "$src"
  done
  [ -d "$STASH" ] && rmdir "$STASH" 2>/dev/null
  for f in "${META_ROUTES[@]}"; do
    [ -f "$f.orig" ] && mv "$f.orig" "$f"
  done
  return 0
}
trap restore EXIT

mkdir -p "$STASH"
for src in "${!PARKED[@]}"; do
  [ -d "$src" ] || { echo "build-static: $src is missing — has it moved?" >&2; exit 1; }
  mv "$src" "${PARKED[$src]}"
done

for f in "${META_ROUTES[@]}"; do
  cp "$f" "$f.orig"
  sed -i 's/^export const dynamic = "force-dynamic";$/export const dynamic = "force-static";/' "$f"
  grep -q 'export const dynamic = "force-static";' "$f" || {
    echo "build-static: could not patch $f — check the dynamic export line" >&2
    exit 1
  }
done

# robots.txt and sitemap.xml are baked in here, so the URL has to be the real
# one — .env carries the dev value, and a build that picked that up would ship
# a sitemap full of localhost links. This export is always the marketing site,
# so both URLs are the same: that is what puts robots.ts on its "main site"
# branch rather than the locked-down portal one.
PUBLIC_URL="${PUBLIC_URL:-https://hunarsaaz.pk}"

STATIC_EXPORT=1 NEXT_PUBLIC_STATIC_FORMS=1 \
  SITE_URL="$PUBLIC_URL" MARKETING_SITE_URL="$PUBLIC_URL" \
  npx next build

# A wrong robots.txt here would quietly delist the whole site, so check rather
# than trust: the main site must allow crawling, and no localhost may survive.
grep -q '^Allow: /$' out/robots.txt || {
  echo "build-static: out/robots.txt does not allow crawling — refusing to ship it" >&2
  exit 1
}
if grep -rq 'localhost' out/robots.txt out/sitemap.xml; then
  echo "build-static: localhost leaked into robots.txt or sitemap.xml" >&2
  exit 1
fi

# Apache config so clean URLs and the 404 page work on cPanel hosts
cat > out/.htaccess << 'HT'
Options -MultiViews -Indexes
ErrorDocument 404 /404.html
HT
echo "Static site written to out/"
