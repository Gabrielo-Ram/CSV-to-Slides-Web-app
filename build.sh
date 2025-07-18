#!/bin/bash
set -e

echo "📦 Building all workspaces..."

for dir in server MCPClient GoogleSlidesMCPServer
do
  echo "➡️  Entering $dir..."
  cd $dir
  npm install --omit=optional  # or npm ci --omit=optional
  npm run build
  cd ..
done

echo "✅ All builds complete."
