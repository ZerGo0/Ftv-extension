# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

- Name: Ftv
- Description: A browser extension for Fansly that adds emote support from Twitch, 7TV, BTTV, and FFZ, plus UI enhancements for chat and discover pages.
- Key notes:
  - Fansly API calls require the signed session token from `localStorage` key `session_active_session`; `fanslyApi` is initialized against the page `window`/`localStorage` and must not be re-created from shadow-root-only contexts.
  - Fansly navigation is client-side; content scripts rely on `MutationObserver` and URL path whitelists instead of page reload assumptions.
  - DOM features are idempotent through attachment classes (for example `ftv-attached`, `ftv-emotes-attached`, `ftv-feed-suggestions-list-attached`); always guard before injecting.
  - `sharedState.initialize()` is throttled to 5 seconds and must run before using `chatroomId` or `twitchUserId`.
  - Network access should go through `deduplicatedFetch` and `Cache<T>` wrappers; avoid raw `fetch` in feature code.
  - Runtime CSS fixes are injected via `src/lib/fanslyStyleFixes.ts` with styles in `src/assets/fanslyStyleFixes.css`.
  - Browser targets are Chromium (MV3) and Firefox (MV2), with different permission handling in `wxt.config.ts`.

## Global Rules

- **NEVER** use emojis!
- **NEVER** try to run the dev server unless explicitly asked.
- **NEVER** try to build in the project directory; always build in the `/tmp` directory unless explicitly asked to build in the project directory.
- **NEVER** use comments in code - code should be self-explanatory
- **NEVER** cut corners, don't leave comments like `TODO: Implement X in the future here`! Always fully implement everything!
- **NEVER** revert/delete any changes that you don't know about! Always assume that we are in the middle of a task and that the changes are intentional!
- **ALWAYS** at the end of your turn, ask a follow-up question for the next logical step (**DON'T** ask questions like "Should I run tests?" or "Should I lint?", only ask questions that are relevant to the task at hand)

## Refactor Using Established Engineering Principles

After generating or editing code, you must always refactor your changes using well-established software engineering principles. These apply every time, without relying on diff inspection.

### Core Principles

- **DRY (Don't Repeat Yourself)**: Eliminate duplicate or repetitive logic by consolidating shared behavior into common functions or helpers.
- **KISS (Keep It Simple, Stupid)**: Prefer simple, straightforward solutions over unnecessarily complex or abstract designs.
- **YAGNI (You Aren't Gonna Need It)**: Only implement what is required for the current task; avoid speculative features or abstractions.

### Refactoring Requirements

1. Ensure the intent of your change is clear, explicit, and easy to understand.
2. Maintain consistency with existing patterns, naming, and structure in the codebase.
3. Remove duplication and merge similar logic following DRY.
4. Simplify complex code paths or structures following KISS.
5. Avoid adding features, hooks, or abstractions that the current task does not need, following YAGNI.

**Principle:**

> Every change must simplify the codebase, reduce duplication, clarify intent, and make the system easier to maintain.

## High-Level Architecture

- Core stack: WXT, Svelte 5 runes, TypeScript, Vite, Tailwind CSS.
- Content entrypoints: `src/entrypoints/chat.content.ts` for chat/live pages and `src/entrypoints/home.content.ts` for home/discover pages.
- Feature composition: `src/lib/entryPoints/*` modules attach isolated UI and behavior using WXT `createShadowRootUi` plus Svelte `mount`/`unmount`.
- Emote system: Provider-based emote loading in `src/lib/emotes/providers/*`, aggregated by rune stores in `src/lib/emotes/*.svelte.ts`.
- API/data layer: `src/lib/api/fansly.svelte.ts` and `src/lib/api/zergo0.ts` with request de-duplication and Promise caching under `src/lib/utils/`.
- Source of truth for shared schema/types: `src/lib/types.ts`.
- Manifest/permissions model: `wxt.config.ts` configures MV3 vs MV2 permissions and browser-specific behavior.

## Project Guidelines

### Ftv Extension (root)

- Language: TypeScript
- Framework/Runtime: WXT + Svelte 5 (runes) + Vite
- Package Manager: pnpm (npm is available as fallback)
- Important Packages: `wxt`, `@wxt-dev/module-svelte`, `svelte`, `vite`, `tailwindcss`, `bits-ui`, `zod`, `clsx`, `tailwind-merge`, `cmdk-sv`, `embla-carousel-svelte`, `svelte-sonner`
- Checks:
  - Type/syntax check: `pnpm check`
  - Lint/format check and normalization: `pnpm lint`
  - **ALWAYS** run these after you are done making changes
- Rules / conventions:
  - **ALWAYS** run the checks listed above after changes.
  - **NEVER** search for or run test suites unless explicitly asked.
  - **ALWAYS** follow existing code patterns in nearby files before introducing new structure.
  - **ALWAYS** use Svelte 5 runes (`$state`) for reactive state files under `src/lib/**.svelte.ts`.
  - **ALWAYS** register content scripts with `defineContentScript` and keep `cssInjectionMode: 'ui'`.
  - **ALWAYS** mount UI with `createShadowRootUi` and Svelte `mount`/`unmount`; add `dark` to each shadow UI container.
  - **ALWAYS** guard DOM attachment/injection with dedicated attachment classes to avoid duplicate work.
  - **ALWAYS** call `sharedState.initialize()` before code paths that depend on chatroom or Twitch IDs.
  - **ALWAYS** use `deduplicatedFetch` plus `Cache<T>` for remote data access and caching behavior.
  - **ALWAYS** implement new emote sources by extending `Provider` in `src/lib/emotes/providers/` and implementing `fetchEmotes()`.
  - **NEVER** scatter API URLs across unrelated modules; keep Fansly/ZerGo0 interactions in API/provider modules.
  - **ALWAYS** keep Fansly CSS patches in `src/assets/fanslyStyleFixes.css` via `src/lib/fanslyStyleFixes.ts`.
  - **ALWAYS** follow repository Prettier settings (2 spaces, single quotes, no trailing commas, print width 100).
- Useful files:
  - `wxt.config.ts`
  - `package.json`
  - `.prettierrc`
  - `src/entrypoints/chat.content.ts`
  - `src/entrypoints/home.content.ts`
  - `src/lib/entryPoints/*`
  - `src/lib/emotes/*`
  - `src/lib/state/state.svelte.ts`
  - `src/lib/api/*`
  - `src/lib/utils/requestDeduplicator.ts`
  - `src/lib/utils/cache.ts`
  - `src/lib/types.ts`
  - `src/assets/fanslyStyleFixes.css`

## Key Architectural Patterns

- MutationObserver-driven SPA integration with strict pathname whitelists.
- Idempotent DOM instrumentation via per-feature attachment classes.
- Provider pattern for emote platforms with a shared `Provider` contract.
- Rune-based class stores (`$state`) for extension-wide reactive data.
- Shadow-root UI mounting per feature, with isolated style injection and dark-theme container setup.
- Request de-duplication and Promise caching to avoid duplicate concurrent API calls.
- Entrypoint orchestration that resets shared caches/stores when route-level roots reattach.
