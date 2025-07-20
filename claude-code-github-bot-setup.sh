#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }

echo -e "${BLUE}Ftv Extension Setup Script${NC}"
echo "=========================="
echo ""

# Check Node.js version
print_info "Checking Node.js version..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! node -p "process.exit(process.version.slice(1) >= '$REQUIRED_VERSION' ? 0 : 1)" 2>/dev/null; then
    print_warning "Node.js version $NODE_VERSION detected. Node.js 18+ is recommended."
else
    print_success "Node.js version $NODE_VERSION is compatible"
fi

# Check if pnpm is available
print_info "Checking pnpm installation..."
if ! command -v pnpm &> /dev/null; then
    print_info "Installing pnpm..."
    if npm install -g pnpm; then
        print_success "pnpm installed successfully"
    else
        print_error "Failed to install pnpm"
        exit 1
    fi
else
    print_success "pnpm is already installed ($(pnpm --version))"
fi

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    echo ""
    print_info "Installing project dependencies..."
    
    # Check if it's a pnpm project
    if [ -f "pnpm-lock.yaml" ]; then
        print_info "Detected pnpm project, installing with pnpm..."
        if pnpm install; then
            print_success "Dependencies installed successfully"
        else
            print_error "Failed to install dependencies"
            exit 1
        fi
    else
        print_warning "No pnpm-lock.yaml found, skipping dependency installation"
    fi
else
    print_error "No package.json found in current directory"
    print_info "Please run this script from the project root directory"
    exit 1
fi

echo ""
print_success "Setup complete!"

# Optional verification step
echo ""
read -p "$(echo -e ${BLUE}Would you like to run verification checks now? \(y/N\): ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Running verification checks..."
    echo ""
    
    print_info "Running Svelte type checking..."
    if pnpm check; then
        print_success "Type checking passed"
    else
        print_warning "Type checking failed - you may need to fix type errors"
    fi
    
    echo ""
    print_info "Running code formatting..."
    if pnpm lint; then
        print_success "Code formatting completed"
    else
        print_warning "Code formatting encountered issues"
    fi
    
    echo ""
    print_success "Verification complete!"
fi

echo ""
echo -e "${BLUE}Available commands:${NC}"
echo "  ${GREEN}pnpm dev${NC}          - Start development server"
echo "  ${GREEN}pnpm dev:firefox${NC}  - Start development server for Firefox"
echo "  ${GREEN}pnpm build${NC}        - Build extension for Chrome (MV3)"
echo "  ${GREEN}pnpm build:firefox${NC} - Build extension for Firefox (MV2)"
echo "  ${GREEN}pnpm check${NC}        - Run Svelte type checking"
echo "  ${GREEN}pnpm lint${NC}         - Format code with Prettier"
echo "  ${GREEN}pnpm zip${NC}          - Create distribution zip files"
echo "  ${GREEN}pnpm release${NC}      - Build and zip for both browsers"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Run ${GREEN}pnpm check && pnpm lint${NC} to verify everything is working"
echo "2. Run ${GREEN}pnpm dev${NC} to start development"
echo "3. Load the extension in your browser's developer mode"