#!/bin/bash

# Setup script for HuyWay Platform (User + Admin)
# This script will clean and reinstall dependencies

echo "🚀 HuyWay Platform Setup"
echo "========================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Step 1: Cleaning old dependencies..."
rm -rf node_modules
rm -f package-lock.json
rm -rf .npm-cache
echo "✅ Cleanup complete"
echo ""

echo "🧹 Step 2: Cleaning npm cache..."
npm cache clean --force
echo "✅ Cache cleaned"
echo ""

echo "📥 Step 3: Installing dependencies..."
echo "This may take a few minutes..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

echo "🔍 Step 4: Running type check..."
npm run typecheck
if [ $? -ne 0 ]; then
    echo "⚠️  Type check found some issues"
    echo "Please review the errors above"
else
    echo "✅ Type check passed"
fi
echo ""

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run 'npm run dev' to start development server"
echo "  2. Visit http://localhost:5173 for user pages"
echo "  3. Login with admin@huyway.com to access /admin"
echo ""
echo "📚 For more info, see:"
echo "  - MIGRATION_GUIDE.md - Complete documentation"
echo "  - SETUP_STATUS.md - Current status and checklist"
