#!/bin/bash
set -e

echo "Claude Code GitHub Bot Setup Script"
echo "==================================="
echo ""

# Check if pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
else
    echo "✓ pnpm is already installed ($(pnpm --version))"
fi

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    echo ""
    echo "Installing project dependencies..."
    
    # Check if it's a pnpm project
    if [ -f "pnpm-lock.yaml" ]; then
        echo "Detected pnpm project, installing with pnpm..."
        pnpm install
    else
        echo "No pnpm-lock.yaml found, skipping dependency installation"
    fi
else
    echo "No package.json found, skipping dependency installation"
fi

echo ""
echo "Setup complete!"
echo ""
echo "Available commands:"
echo "- pnpm check (for Ftv extension project)"