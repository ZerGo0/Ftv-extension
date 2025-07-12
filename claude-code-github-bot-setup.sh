#!/bin/bash
set -e

echo "Claude Code GitHub Bot Setup Script"
echo "==================================="
echo ""

# Check if bun is available
if ! command -v bun &> /dev/null; then
    echo "Installing bun..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
else
    echo "✓ bun is already installed ($(bun --version))"
fi

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
    
    # Check if it's a bun project
    if [ -f "bun.lockb" ]; then
        echo "Detected bun project, installing with bun..."
        bun install
    # Check if it's a pnpm project
    elif [ -f "pnpm-lock.yaml" ]; then
        echo "Detected pnpm project, installing with pnpm..."
        pnpm install
    else
        echo "No lock file detected, skipping dependency installation"
    fi
else
    echo "No package.json found, skipping dependency installation"
fi

echo ""
echo "Setup complete! All required tools are available."
echo ""
echo "Available commands:"
echo "- bun tsc && bun lint (for GitHub bot project)"
echo "- pnpm check (for Ftv extension project)"