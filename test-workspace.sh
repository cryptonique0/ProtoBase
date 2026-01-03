#!/bin/bash
# Quick test script for Project Workspace System

echo "🧪 Testing ProtoBase Project Workspace System"
echo ""

# 1. Check build
echo "1️⃣ Testing build..."
npm run build
if [ $? -eq 0 ]; then
  echo "✅ Build successful"
else
  echo "❌ Build failed"
  exit 1
fi

echo ""

# 2. Check files exist
echo "2️⃣ Checking files..."
FILES=(
  "src/templates/contracts.ts"
  "src/templates/frontend.ts"
  "src/services/workspaceService.ts"
  "src/services/deploymentService.ts"
  "src/components/LaunchProjectButton.tsx"
  "pages/ProjectWorkspacePage.tsx"
  "PROJECT_WORKSPACE_GUIDE.md"
  "WORKSPACE_SUMMARY.md"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file missing"
  fi
done

echo ""
echo "3️⃣ Quick stats:"
echo "- Contract templates: $(grep -c "id:" src/templates/contracts.ts)"
echo "- Frontend templates: $(grep -c "id:" src/templates/frontend.ts)"
echo "- Workspace page lines: $(wc -l < pages/ProjectWorkspacePage.tsx)"

echo ""
echo "✨ All checks complete!"
echo ""
echo "Next steps:"
echo "1. Run: npm run dev"
echo "2. Connect wallet"
echo "3. Go to Ideate → View idea → Launch Project"
echo "4. Select templates and deploy to Base Sepolia"
