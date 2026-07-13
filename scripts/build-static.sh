#!/usr/bin/env bash
# Build a plain-HTML export for shared hosting (no Node.js on the server).
# API routes can't exist in an export build, so they're set aside during it.
set -euo pipefail
cd "$(dirname "$0")/.."

restore() { [ -d .api-stash ] && mv .api-stash src/app/api; }
trap restore EXIT

mv src/app/api .api-stash
STATIC_EXPORT=1 NEXT_PUBLIC_STATIC_FORMS=1 npx next build

# Apache config so clean URLs and the 404 page work on cPanel hosts
cat > out/.htaccess << 'HT'
Options -MultiViews -Indexes
ErrorDocument 404 /404.html
HT
echo "Static site written to out/"
