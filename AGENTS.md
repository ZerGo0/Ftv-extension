# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

- Name: Ftv
- Description: A browser extension for Fansly that adds emote support from popular platforms (Twitch, 7TV, BTTV, FFZ) alongside targeted UI enhancements.
- Key notes:
  - Fansly API calls require the signed session token stored in `localStorage` as `session_active_session`. Construct `FanslyApi` with the live `window`/`localStorage`, outside any shadow root, before handing it to Svelte contexts (`src/lib/api/fansly.svelte.ts`).
  - Content scripts rely on `MutationObserver` plus URL whitelists; attach shadow UIs only once per host element by adding `ftv-*` guard classes (`src/entrypoints/chat.content.ts`, `src/entrypoints/home.content.ts`, `src/lib/entryPoints/*`).
  - Shared state (`src/lib/state/state.svelte.ts`) is throttled (5s). Always call `sharedState.initialize()` once per route activation before reading `chatroomId` or `twitchUserId`.
  - ZerGo0 integrations (pronouns, badges, username paints) require the caches on `zergo0Api` to be cleared on first attachment and refilled through `deduplicatedFetch`.
  - CSS tweaks are injected at runtime via `fanslyStyleFixes` and `src/assets/fanslyStyleFixes.css`; never inline Fansly overrides elsewhere.
  - `CLAUDE.md` is a symbolic link to `AGENTS.md`; edit `AGENTS.md` to update these instructions.

## Global Rules

- **NEVER** use emojis!
- **NEVER** try to run the dev server!
- **NEVER** try to build in the project directory, always build in the `/tmp` directory!
- **ALWAYS** search for existing code patterns in the codebase and follow them consistently
- **NEVER** use comments in code - code should be self-explanatory
- **NEVER** cut corners, don't leave comments like `TODO: Implement X in the future here`! Always fully implement everything!
- **ALWAYS** when you're done, self-critique your work until you're sure it's correct

## High-Level Architecture

- **Extension Platform:** WXT packages the extension (Chromium MV3 and Firefox MV2 builds) using Vite; Svelte 5 runes power all UI.
- **Content Scripts:** `src/entrypoints/*.content.ts` register `defineContentScript` handlers that mount shadow-root UIs via `createShadowRootUi` and coordinate feature modules under `src/lib/entryPoints/*`.
- **UI Layer:** Components in `src/lib/components` and runes stores in `src/lib/**/*.svelte.ts` manage reactive state; shadow containers must call `ui.uiContainer.classList.add('dark')`.
- **Networking:** `src/lib/api/fansly.svelte.ts` and `src/lib/api/zergo0.ts` wrap all remote calls, backed by `deduplicatedFetch`, `src/lib/utils/requestDeduplicator.ts`, and the simple caches in `src/lib/utils/cache.ts`.
- **Emote Providers:** `src/lib/emotes/providers/*` extend `Provider` and populate stores in `src/lib/emotes/emotes.svelte.ts` and `providers.svelte.ts`, aggregating Twitch, 7TV, FFZ, BTTV, and ZerGo0 sources.
- **Styling:** Fansly-specific CSS is injected via `src/lib/fanslyStyleFixes.ts`, sourcing rules from `src/assets/fanslyStyleFixes.css`; Tailwind utilities depend on the shadow root `dark` theme.
- **Schema Source of Truth:** Shared types live in `src/lib/types.ts`; update them before touching downstream modules.

## Project Guidelines

### Ftv Extension (root)

- Language: TypeScript
- Framework/Runtime: WXT + Svelte 5 (runes) on Vite
- Package Manager: pnpm (npm only as fallback when pnpm is unavailable)
- Important Packages:
  - `wxt`
  - `@wxt-dev/module-svelte`
  - `svelte`
  - `vite`
  - `tailwindcss`
  - `bits-ui`
  - `lucide-svelte`
  - `zod`
  - `cmdk-sv`
  - `embla-carousel-svelte`
  - `svelte-sonner`
- Checks:
  - Syntax Check: `pnpm check`
  - Lint: `pnpm lint` (runs Prettier with Svelte and Tailwind plugins and writes changes)
  - Format: `pnpm lint` (rerun to rewrite formatting after edits)
  - **ALWAYS** run these after you are done making changes
- Rules / Conventions:
  - **ALWAYS** use Svelte 5 runes (`$state`) for reactive stores in `src/lib/**.svelte.ts`.
  - **ALWAYS** mount UI through WXT `createShadowRootUi`, add the `dark` class to `ui.uiContainer`, and clean up with the returned `destroy` handlers.
  - **ALWAYS** guard DOM work with attachment classes such as `ftv-attached` or `ftv-feed-suggestions-list-attached` to avoid duplicate injections.
  - **ALWAYS** call `sharedState.initialize()` once per route activation before relying on `chatroomId` or `twitchUserId`.
  - **ALWAYS** route network traffic through the API wrappers and `deduplicatedFetch`, extending caches when new endpoints are introduced.
  - **ALWAYS** keep Fansly UI adjustments in `src/lib/fanslyStyleFixes.ts` and `src/assets/fanslyStyleFixes.css`; do not scatter style overrides.
  - **NEVER** introduce raw `fetch` calls or bypass the cache/deduplication utilities.
  - **NEVER** duplicate emote provider logic; extend `Provider` in `src/lib/emotes/providers/*` and register via the existing stores.
  - **NEVER** run test suites or search for them unless a human explicitly requests it; do not attempt to auto-discover tests.
  - **NEVER** skip resetting ZerGo0 caches when attaching to a new chatroom; rely on the established helper flow.
- Useful files:
  - `wxt.config.ts` — Extension manifest configuration and build targets.
  - `src/entrypoints/chat.content.ts` — Chat page bootstrapper orchestrating emote, account, and suggestion features.
  - `src/entrypoints/home.content.ts` — Home/discover bootstrapper for feed-specific enhancements.
  - `src/lib/entryPoints/*` — Feature modules that attach UI/logic to Fansly DOM nodes via shadow roots.
  - `src/lib/emotes/*` — Runes stores and provider implementations for emote ingestion.
  - `src/lib/state/state.svelte.ts` — Shared state singleton exposing Fansly/Twitch identifiers.
  - `src/lib/utils/requestDeduplicator.ts` & `src/lib/utils/cache.ts` — Request and data deduplication primitives.
  - `src/assets/fanslyStyleFixes.css` — Fansly-specific style overrides injected at runtime.
  - `.prettierrc` — Formatting contract for TypeScript, Svelte, and Tailwind.

## Patterns Directory

- `.zergo0/patterns/` is the canonical catalog produced by the `patterns` command; consult it before starting new features to reuse proven solutions.
- Review existing pattern writeups when touching related code paths, and extend the documentation only after the new approach has shipped and aligns with established conventions.
- When adding to the catalog, document intent, prerequisites, and integration points so future automation can apply the pattern safely; keep examples minimal and reference actual modules.
- If the directory is missing, create it alongside new pattern documents so automation remains discoverable in future runs.

## Key Architectural Patterns

- **Mutation-Driven Attachments:** `MutationObserver` plus URL whitelists coordinate single-page routing; guard every injected node with attachment classes to ensure idempotency.
- **Provider Abstraction:** Emote sources subclass `Provider`, exposing consistent `fetchEmotes()` behavior so stores can aggregate global/channel emotes seamlessly.
- **Runes-Based State:** `$state` fields in `.svelte.ts` modules manage shared data; reset providers, caches, and stores on chat transitions to avoid stale UI.
- **Shadow UI Mounting:** All UI mounts live inside WXT-managed shadow roots with the `dark` theme, keeping Tailwind scopes predictable and avoiding Fansly collisions.
- **Request Deduplication:** `deduplicatedFetch`, cache helpers, and ZerGo0 API caches prevent redundant network calls and provide shared responses across features.
- **Multi-Platform Builds:** WXT build scripts emit Chromium MV3 and Firefox MV2 bundles; keep logic manifest-safe and mindful of permissions in `wxt.config.ts`.

<answer-structure>
## MANDATORY Answer Format

**CRITICAL:** You MUST follow these exact formatting rules for ALL responses. No exceptions.

**ABSOLUTE Requirements:**
- ALWAYS use the exact structure below
- NEVER deviate from the specified format
- ALWAYS end with a task-related follow-up question
- ALWAYS keep responses concise (≤10 lines unless technical details require more)

**EXACT Structure Template:**
```
Completed {task}.

**What I Changed**
- {high_level_summary}
- {key_approach_points}

**Key Files**
- Updated: `{file_path}` ({brief_change})
- Added: `{file_path}` ({purpose})

**Implementation Details**
- {technical_approach}
- {key_code_example}

**Validation**
- Types: `{typecheck_command}` passes
- Lint: `{lint_command}` passes
- {additional_validation_step}

{task_related_follow_up_question}
```

**NON-NEGOTIABLE Formatting Rules:**
- Headers: EXACTLY `**Title Case**` (1-3 words only)
- Bullets: ALWAYS start with `- ` (dash, space)
- Monospace: ALWAYS use backticks for commands, paths, code
- File references: ALWAYS use `path:line` format
- NEVER use conversational tone outside the follow-up question
- NEVER mention saving files or copying code
- NEVER suggest procedural actions (tests, commits, builds)

**MANDATORY Follow-up Questions:**
- MUST relate to extending functionality
- MUST explore edge cases or alternatives
- MUST be task-related (never procedural)

**NO EXCEPTIONS** to these rules regardless of request type, complexity, or perceived user intent.
</answer-structure>