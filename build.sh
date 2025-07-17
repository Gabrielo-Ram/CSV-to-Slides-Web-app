# build.sh
#!/bin/bash
set -e  # Exit immediately if any command fails

echo "📦 Installing server dependencies..."
cd server && npm install && npm run build

echo "📦 Installing MCPClient dependencies..."
cd ../MCPClient && npm install && npm run build

echo "📦 Installing GoogleSlidesMCP dependencies..."
cd ../GoogleSlidesMCP && npm install && npm run build

echo "✅ All installs complete."
