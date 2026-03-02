#!/bin/bash

# St. Mark's Event Sign Ups - Git Setup Script
# This script will initialize Git and prepare for deployment

echo "🚀 Setting up Git for St. Mark's Event Sign Ups..."
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   - Mac: brew install git"
    echo "   - Windows: Download from https://git-scm.com"
    echo "   - Linux: sudo apt-get install git"
    exit 1
fi

# Initialize git repository
echo "📁 Initializing Git repository..."
git init

# Add all files
echo "📝 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: St. Mark's Event Sign Ups application"

echo ""
echo "✅ Git repository initialized!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "NEXT STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   → Go to https://github.com/new"
echo "   → Name it: st-marks-event-signups"
echo "   → Keep it public or private"
echo "   → Don't initialize with README (we already have one)"
echo "   → Click 'Create repository'"
echo ""
echo "2. Copy the repository URL (it looks like):"
echo "   https://github.com/YOUR_USERNAME/st-marks-event-signups.git"
echo ""
echo "3. Run these commands (replace YOUR_GITHUB_URL):"
echo ""
echo "   git remote add origin YOUR_GITHUB_URL"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Connect Netlify to GitHub:"
echo "   → Go to https://app.netlify.com"
echo "   → Click 'Add new site' → 'Import an existing project'"
echo "   → Choose 'GitHub'"
echo "   → Select 'st-marks-event-signups'"
echo "   → Click 'Deploy'"
echo ""
echo "5. Add your Neon database URL to Netlify:"
echo "   → Netlify dashboard → Site settings → Environment variables"
echo "   → Add variable: DATABASE_URL"
echo "   → Paste your Neon connection string"
echo "   → Click 'Save'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 After that, you're done! Every time you push to GitHub,"
echo "   Netlify will automatically deploy your changes."
echo ""
echo "To make updates in the future:"
echo "   1. Edit your files"
echo "   2. git add ."
echo "   3. git commit -m 'Description of changes'"
echo "   4. git push"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"