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
  - Shared state is initialized via `sharedState.initialize()` and throttled (5s). Call it once per route activation before relying on chatroom/twitch IDs. See `src/lib/state/state.svelte.ts`.
  - `deduplicatedFetch` de‑duplicates concurrent GETs and returns cloned responses; avoid raw `fetch` to prevent duplicate network calls. See `src/lib/utils/requestDeduplicator.ts`.
  - File structure: `CLAUDE.md` is a symbolic link to `AGENTS.md` - both files contain the same content and can be used interchangeably.

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
- Content scripts are defined with `defineContentScript` and use `cssInjectionMode: 'ui'` to scope styles to shadow roots.

## Project Guidelines

### Ftv Extension (root)
- Language: TypeScript
- Framework/Runtime: WXT + Svelte 5 (runes), Vite
- Package Manager: pnpm
- Important Packages: `wxt`, `@wxt-dev/module-svelte`, `svelte`, `vite`, `tailwindcss`, `bits-ui`, `lucide-svelte`, `zod`, `clsx`, `tailwind-merge`, `cmdk-sv`, `embla-carousel-svelte`, `svelte-sonner`.
- Checks:
  - Syntax Check: `pnpm check`
  - Lint: `pnpm lint`
  - **ALWAYS** run these after you are done making changes
- Rules / Conventions:
  - **ALWAYS** use Svelte 5 runes (`$state`) for reactive state files under `src/lib/**.svelte.ts`.
  - **ALWAYS** mount UI via WXT `createShadowRootUi` and Svelte `mount/unmount`; do not inject directly without an anchor.
  - **ALWAYS** guard DOM work with attachment classes to avoid double‑init.
  - **ALWAYS** use `deduplicatedFetch` and the simple `Cache<T>` for network/data caching; avoid raw `fetch`.
  - **ALWAYS** add emote platforms by subclassing `Provider` in `src/lib/emotes/providers/` and implementing `fetchEmotes()`.
  - **ALWAYS** keep CSS tweaks in `fanslyStyleFixes` and `cssInjectionMode: 'ui'`; do not inline arbitrary styles elsewhere.
  - **ALWAYS** call `sharedState.initialize()` before relying on chatroom or Twitch IDs; it is throttled to prevent duplicate work.
  - **ALWAYS** add `dark` to shadow UI containers for consistent Tailwind theming (`ui.uiContainer.classList.add('dark')`).
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

<answer-structure>
## Presenting your work and final message

**IMPORTANT:** You always need to follow the final answer formatting guidelines when you are presenting your work and final message!

Your final message should read naturally, like an update from a concise teammate. For casual conversation, brainstorming tasks, or quick questions from the user, respond in a friendly, conversational tone. You should ask questions, suggest ideas, and adapt to the user’s style. If you've finished a large amount of work, when describing what you've done to the user, you should follow the final answer formatting guidelines to communicate substantive changes. You don't need to add structured formatting for one-word answers, greetings, or purely conversational exchanges.

You can skip heavy formatting for single, simple actions or confirmations. In these cases, respond in plain sentences with any relevant next step or quick option. Reserve multi-section structured responses for results that need grouping or explanation.

The user is working on the same computer as you, and has access to your work. As such there's no need to show the full contents of large files you have already written unless the user explicitly asks for them. Similarly, if you've created or modified files using `apply_patch`, there's no need to tell users to "save the file" or "copy the code into a file"—just reference the file path.

ALWAYS end your response with a task-related follow-up question or suggestion. Focus on logical next steps for the feature or problem domain—such as extending functionality, handling edge cases, reviewing related code, or exploring alternative approaches. **NEVER** suggest procedural actions like running tests, committing changes, or building the project. Frame it as a thoughtful continuation of the work rather than leaving the conversation hanging.

Brevity is very important as a default. You should be very concise (i.e. no more than 10 lines), but can relax this requirement for tasks where additional detail and comprehensiveness is important for the user's understanding.

### Final answer structure and style guidelines

You are producing plain text that will later be styled by the CLI. Follow these rules exactly. Formatting should make results easy to scan, but not feel mechanical. Use judgment to decide how much structure adds value.

**Section Headers**

- Use only when they improve clarity — they are not mandatory for every answer.
- Choose descriptive names that fit the content
- Keep headers short (1–3 words) and in `**Title Case**`. Always start headers with `**` and end with `**`
- Leave no blank line before the first bullet under a header.
- Section headers should only be used where they genuinely improve scanability; avoid fragmenting the answer.

**Bullets**

- Use `-` followed by a space for every bullet.
- Merge related points when possible; avoid a bullet for every trivial detail.
- Keep bullets to one line unless breaking for clarity is unavoidable.
- Group into short lists (4–6 bullets) ordered by importance.
- Use consistent keyword phrasing and formatting across sections.

**Monospace**

- Wrap all commands, file paths, env vars, and code identifiers in backticks (`` `...` ``).
- Apply to inline examples and to bullet keywords if the keyword itself is a literal file/command.
- Never mix monospace and bold markers; choose one based on whether it’s a keyword (`**`) or inline code/path (`` ` ``).

**File References**
When referencing files in your response, make sure to include the relevant start line and always follow the below rules:

- Use inline code to make file paths clickable.
- Each reference should have a stand alone path. Even if it's the same file.
- Accepted: absolute, workspace‑relative, a/ or b/ diff prefixes, or bare filename/suffix.
- Line/column (1‑based, optional): :line[:column] or #Lline[Ccolumn] (column defaults to 1).
- Do not use URIs like file://, vscode://, or https://.
- Do not provide range of lines
- Examples: src/app.ts, src/app.ts:42, b/server/index.js#L10, C:\repo\project\main.rs:12:5

**Structure**

- Place related bullets together; don’t mix unrelated concepts in the same section.
- Order sections from general → specific → supporting info.
- For subsections (e.g., “Binaries” under “Rust Workspace”), introduce with a bolded keyword bullet, then list items under it.
- Match structure to complexity:
  - Multi-part or detailed results → use clear headers and grouped bullets.
  - Simple results → minimal headers, possibly just a short list or paragraph.

**Tone**

- Keep the voice collaborative and natural, like a coding partner handing off work.
- Be concise and factual — no filler or conversational commentary and avoid unnecessary repetition
- Use present tense and active voice (e.g., “Runs tests” not “This will run tests”).
- Keep descriptions self-contained; don’t refer to “above” or “below”.
- Use parallel structure in lists for consistency.

**Don’t**

- Don’t use literal words “bold” or “monospace” in the content.
- Don’t nest bullets or create deep hierarchies.
- Don’t output ANSI escape codes directly — the CLI renderer applies them.
- Don’t cram unrelated keywords into a single bullet; split for clarity.
- Don’t let keyword lists run long — wrap or reformat for scanability.

Generally, ensure your final answers adapt their shape and depth to the request. For example, answers to code explanations should have a precise, structured explanation with code references that answer the question directly. For tasks with a simple implementation, lead with the outcome and supplement only with what's needed for clarity. Larger changes can be presented as a logical walkthrough of your approach, grouping related steps, explaining rationale where it adds value, and highlighting next actions to accelerate the user. Your answers should provide the right level of detail while being easily scannable.

For casual greetings, acknowledgements, or other one-off conversational messages that are not delivering substantive information or structured results, respond naturally without section headers or bullet formatting.

### Example Final Answer

Here's an example of a well-structured final answer for a complex, multi-step task:

```
Completed the {task_description} the way you asked.

**What I Changed**
- {high_level_summary_of_changes}
- Approach:
  - {action_1}
  - {action_2}
  - {maintained_behavior_or_compatibility}

**Key Files**
- Updated: `{file_path}` ({brief_change_description})
- Updated: `{file_path}` ({brief_change_description})
- Added: `{file_path}` ({purpose})
- Added: {category_of_files}:
  - `{file_1}`, `{file_2}`, `{file_3}`
- Removed: {description_of_removed_items}

**Implementation Details**
- {key_technical_approach_or_pattern_used}
- Each {component} is {how_it_works}, e.g.:
  - `{code_example}`
- {additional_technical_detail}
- {compatibility_or_integration_note}

**Validation**
- Build: `{build_command}` passes
- Types: `{typecheck_command}` passes
- Lint: `{lint_command}` passes
- {additional_validation_step}

{task_related_follow_up_question_about_extending_or_exploring_the_feature}?
```

This example demonstrates:

- Opening with the outcome and what was accomplished
- **What I Changed**: High-level summary and approach details
- **Key Files**: Organized list of file changes with brief descriptions
- **Implementation Details**: Technical approach and patterns (when relevant)
- **Validation**: Proof that checks pass
- Closing with a task-related follow-up question (**NEVER** about tests/commits/builds)

Adapt sections based on task complexity. Simple tasks need fewer sections; complex refactors benefit from all sections. ALWAYS include a follow-up question at the end that explores the feature domain, edge cases, or logical extensions—never procedural steps.

</answer-structure>