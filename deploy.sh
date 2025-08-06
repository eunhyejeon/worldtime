#!/bin/bash

# 🚀 World Time Checker Deployment Script

echo "🌍 Building World Time Checker..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Type check
echo "🔍 Running type check..."
npm run type-check

# Build for production
echo "🏗️ Building for production..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Built files are in ./dist/"
    echo ""
    echo "🚀 Ready to deploy!"
    echo "   - Vercel: vercel --prod"
    echo "   - Netlify: drag ./dist/ to netlify.com/drop"
    echo "   - Custom: upload ./dist/ to your server"
else
    echo "❌ Build failed!"
    exit 1
fi