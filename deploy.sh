#!/bin/bash

# 🚀 Deployment Script for Render

echo "🚀 Starting deployment process..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Ready for deployment"
fi

# Check current status
echo "📊 Current Git status:"
git status

# Add all files (respecting .gitignore)
echo "📦 Adding files to Git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Ready for Render deployment - $(date)"

# Check if remote exists
if ! git remote | grep -q origin; then
    echo "⚠️  No remote repository found!"
    echo "📝 Please create a GitHub repository and run:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    echo "   git push -u origin main"
else
    echo "🚀 Pushing to GitHub..."
    git push origin main
fi

echo "✅ Deployment preparation complete!"
echo ""
echo "🔧 Next steps for Render deployment:"
echo "1. Create two services on Render:"
echo "   - Backend: Web Service (Python)"
echo "   - Frontend: Static Site"
echo "2. Set environment variables in Render dashboard"
echo "3. Connect your GitHub repository"
echo "4. Deploy!"
echo ""
echo "📋 See RENDER_DEPLOYMENT_GUIDE.md for detailed instructions"
