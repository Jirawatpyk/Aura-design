#!/bin/bash
set -e
cd "$(dirname "$0")"
VERSION=$(node -p "require('./package.json').version")
echo "Building @jirawatpyk/aura-tokens v$VERSION"
node scripts/build-tokens.js
node scripts/a11y-check.js
rm -rf dist && mkdir -p dist/components
cp tokens.json aura.css aura-fonts.css aura-fonts.local.css aura-tailwind.css aura-tailwind.prefixed.css tailwind.config.ts tailwind.tokens.cjs figma-variables.csv eslint-plugin-aura.js dist/
cp -r fonts dist/
cp components/aura.bundle.js components/aura.components.css components/index.d.ts dist/components/
echo "Build done - ready to publish"
ls -lh dist dist/components
