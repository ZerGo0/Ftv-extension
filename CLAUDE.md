# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
- Name
  - Ftv (Fansly emote browser extension)
- Description
  - Adds emote support from Twitch, 7TV, BTTV, and FFZ to Fansly chat using WXT + Svelte 5.
- Key notes or warnings (e.g. API quirks, data formats, environment caveats)
  - Content scripts run only on fansly.com and initialize via MutationObserver; avoid assumptions about full page reloads.
  - Fansly API calls require an auth token read from `localStorage['session_active_session']`; calls must originate in page context.
  - Path alias `@/...` is provided by WXT (`wxt prepare` on install) rather than by this repo’s `tsconfig.json`.
  - Host permissions and matches are declared in `wxt.config.ts`; changing endpoints requires updating manifest permissions.

## Global Rules
The following rules MUST always be included verbatim in every CLAUDE.md:
- **NEVER** use emojis!
- **NEVER** try to run the dev server!
- **NEVER** try to build in the project directory, always build in the `/tmp` directory!
- **ALWAYS** search for existing code patterns in the codebase and follow them consistently
- **NEVER** use comments in code — code should be self-explanatory

## High-Level Architecture
- Databases, services, frameworks, or core technologies
  - WXT (web extension tooling), Svelte 5 (runes), TypeScript, Vite, Tailwind CSS, PNPM.
  - External services: Fansly REST endpoints and a companion service at `zergo0_bot.zergo0.dev` (emotes, badges, username paint).
- How different systems interact (backend, frontend, workers, etc.)
  - Entry content scripts (`src/entrypoints/*.content.ts`) mount features into Fansly pages and inject UI (`cssInjectionMode: 'ui'`).
  - Feature modules in `src/lib/entryPoints/` attach to specific DOM targets and react to live mutations.
  - Network access is encapsulated in `src/lib/api/fansly.svelte.ts` and `src/lib/api/zergo0.ts`, using `deduplicatedFetch` to coalesce duplicate GETs.
  - Global state and emote/provider stores live as Svelte 5 runes-backed singletons.
- Where the source of truth lives for schemas or shared types
  - `src/lib/types.ts` defines Fansly response shapes and core domain types (e.g., `Emote`).

## Project Guidelines
For each major project in the monorepo:
- Language(s) used
  - TypeScript, Svelte 5 (runes)
- Framework(s) / runtime
  - WXT (browser extension), Vite build tool; Tailwind for styling.
- Package manager
  - PNPM
- Important Packages (key dependencies)
  - `wxt`, `@wxt-dev/module-svelte`, `svelte`, `tailwindcss`, `bits-ui`, `lucide-svelte`, `zod`, `svelte-sonner`, `paneforge`, `vaul-svelte`, `embla-carousel-svelte`, `prettier-plugin-svelte`.
- Checks
  - Run on every change: `pnpm check && pnpm lint`.
- Rules / conventions (prefer ALWAYS/NEVER)
  - ALWAYS initialize page features via `src/lib/entryPoints/*` triggered from content scripts.
  - ALWAYS gate DOM mounts with an attachment class (e.g., `ftv-*-attached`) to prevent duplicates.
  - ALWAYS use the Provider pattern (`src/lib/emotes/providers/provider.ts`) for emote sources and implement `fetchEmotes`.
  - ALWAYS centralize shared types in `src/lib/types.ts` and update call sites accordingly.
  - ALWAYS use Svelte 5 runes (`$state`) for shared reactive state in singleton stores.
  - ALWAYS use `src/lib/utils/requestDeduplicator.ts` for GET requests that may fire concurrently.
  - NEVER call Fansly endpoints directly; route through `fanslyApi` which manages auth token and headers.
  - NEVER bypass `wxt.config.ts` manifest/matches when adding new hosts or pages; update permissions accordingly.
- Useful files (only those that need calling out)
  - `wxt.config.ts` – Manifest, permissions, and dev start URLs.
  - `src/entrypoints/chat.content.ts`, `src/entrypoints/home.content.ts` – Content script entry points.
  - `src/lib/entryPoints/*` – Feature attach points (emotes, menu button, suggestions, autocomplete, account card, view count).
  - `src/lib/emotes/emotes.svelte.ts`, `src/lib/emotes/providers.svelte.ts`, `src/lib/emotes/providers/*` – Emote stores and providers.
  - `src/lib/state/state.svelte.ts` – Global shared state and initialization.
  - `src/lib/api/fansly.svelte.ts`, `src/lib/api/zergo0.ts` – API clients.
  - `src/lib/utils/requestDeduplicator.ts` – Request coalescing.

## Key Architectural Patterns
- MutationObserver-based initialization with URL-path whitelists to handle client-side routing on Fansly.
- Provider pattern for emote sources; providers fetch and expose `Emote[]` to global stores.
- Svelte 5 runes singletons (`$state`) for cross-feature reactivity without explicit stores.
- UI injection via WXT (`cssInjectionMode: 'ui'`) and modular Svelte components under `src/lib/components`.
- Attachment-class convention to ensure idempotent mounts and avoid duplicate observers.
