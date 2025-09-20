# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
- Name: Ftv
- Description: A browser extension for Fansly that adds emote support from popular platforms (Twitch, 7TV, BTTV, FFZ) and small UI enhancements.
- Key notes:
  - Fansly API calls require the signed session token from `localStorage` (`session_active_session`). `FanslyApi` is first constructed with real `window`/`localStorage` and must be initialized outside a shadow root. See `src/lib/api/fansly.svelte.ts`.
  - Content logic runs via `MutationObserver` because Fansly uses client‑side routing; only act on whitelisted paths. See `src/entrypoints/chat.content.ts` and `src/entrypoints/home.content.ts`.
  - Duplicate work is prevented with attachment classes (e.g., `ftv-attached`, `ftv-feed-suggestions-list-attached`). Always guard DOM injections.
  - External services: Fansly (`https://apiv3.fansly.com`), ZerGo0 endpoints (`https://zergo0_bot.zergo0.dev`). All requests should go through `deduplicatedFetch` and caches in `src/lib/utils/`.
  - CSS tweaks are injected at runtime; see `src/lib/fanslyStyleFixes.ts` and `src/assets/fanslyStyleFixes.css`.

## Global Rules

- **NEVER** use emojis!
- **NEVER** try to run the dev server!
- **NEVER** try to build in the project directory, always build in the `/tmp` directory!
- **ALWAYS** search for existing code patterns in the codebase and follow them consistently
- **NEVER** use comments in code — code should be self-explanatory

## High-Level Architecture
- Core technologies: WXT, Svelte 5 (runes), TypeScript, Vite, Tailwind CSS.
- Extension entrypoints: `src/entrypoints/chat.content.ts` (chat pages) and `src/entrypoints/home.content.ts` (home/discover).
- Feature modules: `src/lib/entryPoints/*` are initialized by content scripts and attach UI/logic via WXT `createShadowRootUi` + Svelte `mount/unmount`.
- Emote system: `src/lib/emotes/` with runes stores (`emotes.svelte.ts`, `providers.svelte.ts`) and provider implementations in `src/lib/emotes/providers/*` that extend `Provider` and implement `fetchEmotes()`.
- State: Global reactive state in `src/lib/state/state.svelte.ts` using `$state` (runes), including throttled initialization and shared derived data.
- Networking: `src/lib/api/fansly.svelte.ts` and `src/lib/api/zergo0.ts` wrap external calls; request de‑duplication and simple caches live in `src/lib/utils/requestDeduplicator.ts` and `src/lib/utils/cache.ts`.
- Schema/Types source of truth: `src/lib/types.ts`.

## Project Guidelines

### Ftv Extension (root)
- Language: TypeScript
- Framework/Runtime: WXT + Svelte 5 (runes), Vite
- Package Manager: pnpm
- Important Packages: `wxt`, `@wxt-dev/module-svelte`, `svelte`, `vite`, `tailwindcss`, `bits-ui`, `lucide-svelte`, `zod`.
- Checks:
  - Syntax Check: `pnpm check`
  - Lint: `pnpm lint`
  - Claude must run these every time after making changes
- Rules / Conventions:
  - **ALWAYS** use Svelte 5 runes (`$state`) for reactive state files under `src/lib/**.svelte.ts`.
  - **ALWAYS** mount UI via WXT `createShadowRootUi` and Svelte `mount/unmount`; do not inject directly without an anchor.
  - **ALWAYS** guard DOM work with attachment classes to avoid double‑init.
  - **ALWAYS** use `deduplicatedFetch` and the simple `Cache<T>` for network/data caching; avoid raw `fetch`.
  - **ALWAYS** add emote platforms by subclassing `Provider` in `src/lib/emotes/providers/` and implementing `fetchEmotes()`.
  - **ALWAYS** keep CSS tweaks in `fanslyStyleFixes` and `cssInjectionMode: 'ui'`; do not inline arbitrary styles elsewhere.
  - **NEVER** assume page reloads; rely on `MutationObserver` + path whitelists.
  - **NEVER** scatter API URLs; use the API modules in `src/lib/api/`.
- Useful files:
  - `wxt.config.ts` — WXT configuration, MV3/MV2 host permissions.
  - `src/entrypoints/chat.content.ts` — Chat page bootstrapping and feature orchestration.
  - `src/entrypoints/home.content.ts` — Home/discover bootstrapping.
  - `src/lib/entryPoints/*` — Modular feature attach points (emotes, menu button, account card, autocomplete, suggestions, view count).
  - `src/lib/emotes/*` — Emote stores and provider implementations.
  - `src/lib/state/state.svelte.ts` — Shared runes‑based state.
  - `src/lib/api/*` — Fansly and ZerGo0 API wrappers.
  - `src/lib/utils/*` — Request de‑duplication and Promise caches.
  - `src/assets/fanslyStyleFixes.css` — Injected CSS adjustments.

## Key Architectural Patterns
- MutationObserver + URL whitelist for single‑page routing, with idempotent attachment via classes.
- Provider pattern for emote sources; one interface, multiple platform implementations.
- Svelte 5 runes for state; stores as lightweight classes with `$state` fields.
- WXT UI mounting into shadow roots; CSS injected via dedicated helper and `cssInjectionMode: 'ui'`.
- Request de‑duplication and Promise‑based caching to minimize redundant network calls.
