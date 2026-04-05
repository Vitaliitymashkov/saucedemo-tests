#!/bin/bash
set -e

echo "Checking for GitHub CLI (gh)..."
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed."
    echo "Please install it by running: brew install gh"
    echo "Then authenticate by running: gh auth login"
    exit 1
fi

echo "Setting GitHub Actions secrets for SauceDemo..."

if [ -f .env ]; then
    set -a
    source .env
    set +a
else
    echo "❌ Error: .env file not found."
    exit 1
fi

# We use the exported environment variables safely
echo "$STANDARD_USER_USERNAME"
echo "$STANDARD_USER_PASSWORD"
echo "$LOCKED_OUT_USER_USERNAME"
echo "$LOCKED_OUT_USER_PASSWORD"
gh secret set STANDARD_USER_USERNAME --body "$STANDARD_USER_USERNAME"
gh secret set STANDARD_USER_PASSWORD --body "$STANDARD_USER_PASSWORD"
gh secret set LOCKED_OUT_USER_USERNAME --body "$LOCKED_OUT_USER_USERNAME"
gh secret set LOCKED_OUT_USER_PASSWORD --body "$LOCKED_OUT_USER_PASSWORD"

echo "✅ All secrets have been successfully set in your GitHub repository!"
