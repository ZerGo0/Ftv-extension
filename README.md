# Ftv

A emote extension for Fansly which adds support for emotes from popular emote platforms.

## Features

- 300+ emote slots
- Support for animated and wide emotes
- All kinds of images including WEBP are supported
- Support for emotes from popular emote platforms

## Supported Browsers

- [x] Chromium - Chrome, Edge, Opera, Brave, etc.
- [ ] Firefox - Currently needs a patch to fix the `proto is null` error
  - `proto is null` error in Firefox: [svelte #13691](https://github.com/sveltejs/svelte/issues/13691)
    - node_modules/svelte/src/internal/client/dom/elements/attributes.js
    - ```js
      while (proto && proto.constructor.name !== 'Element') {
      ```

## Disclaimer

The Ftv browser extension is not associated with Fansly, Twitch, 7TV, FFZ, or BTTV. The extension adds support for emotes from these platforms, but the content and rights remain with the respective platforms. The Ftv browser extension is not responsible for any content provided by these platforms, and the use of the extension does not imply endorsement of any kind.

## Development

### Install

```bash
pnpm i
```

### Dev

```bash
pnpm dev
```

### Build

```bash
pnpm build
```
