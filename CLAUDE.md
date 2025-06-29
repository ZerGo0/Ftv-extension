# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ftv is a browser extension for Fansly that adds emote support from popular platforms (Twitch, 7TV, BTTV, FFZ). It's built with:

- **WXT** - Web extension framework
- **Svelte 5** - UI framework with runes
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **PNPM** - Package manager

## Rules

- **ALWAYS** run `pnpm check` after making changes!

## Architecture

### Content Scripts

The extension uses two main content scripts in `src/entrypoints/`:

- `chat.content.ts` - Main functionality for chat pages (emotes, UI components)
- `home.content.ts` - Home page features

### Entry Points System

The `src/lib/entryPoints/` directory contains modular features that are initialized by the main content script:

- `chatEmotes.ts` - Parses chat messages and replaces text with emote images
- `emoteMenuButton.ts` - Adds emote picker UI to chat input
- `accountCard.ts` - Enhances user profile cards
- `chatUsernameAutoComplete.ts` - Username autocompletion
- `viewCount.ts` - View count tracking

### Emote System

Core emote functionality in `src/lib/emotes/`:

- `emotes.svelte.ts` - Global emote store using Svelte 5 runes
- `providers.svelte.ts` - Emote provider store
- `providers/` - Individual emote platform implementations (Twitch, 7TV, BTTV, FFZ)

### State Management

Uses Svelte 5 runes pattern with reactive stores:

- `$state` for reactive data
- Global stores in `src/lib/emotes/` and `src/lib/state/`

### UI Components

Svelte components in `src/lib/components/` using:

- Bits UI for base components
- Tailwind for styling
- Lucide for icons

### Key Patterns

1. **MutationObserver-based initialization** - Handles Fansly's client-side routing
2. **Provider pattern** - Each emote platform implements the `Provider` interface
3. **Modular entry points** - Features are self-contained and initialized independently
4. **CSS injection via WXT** - Styles are injected through the extension framework

### Development Notes

- Extension targets specific Fansly URLs with regex patterns
- Uses attachment classes to prevent duplicate initialization
- Emotes are fetched asynchronously and cached in reactive stores
- Chat message parsing happens in real-time via MutationObserver
