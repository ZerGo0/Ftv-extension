import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-svelte"],
  webExt: {
    chromiumArgs: ["--user-data-dir=./private/.dev-profile"],
    startUrls: [
      "https://fansly.com/chatroom/408830844350771200",
      "https://fansly.com/live/zergo0_bot",
      "https://fansly.com/creator/streaming",
    ],
  },
  manifest: ({ browser, manifestVersion, mode, command }) => {
    return {
      manifest_version: manifestVersion,
      name: "Ftv",
      description:
        "Ftv adds support for Twitch, 7TV, BTTV, and FFZ emotes to your fansly chat.",
      // version: "0.0.0", package.json version is used by default
      host_permissions:
        manifestVersion === 3
          ? ["https://apiv3.fansly.com/*", "https://zergo0_bot.zergo0.dev/*"]
          : undefined,
      permissions:
        manifestVersion === 2
          ? [
              "https://*.fansly.com/*",
              "https://zergo0_bot.zergo0.dev/*",
              "https://*.twitch.tv/*",
              "https://*.7tv.io/*",
              "https://*.bttv.net/*",
              "https://*.betterttv.net/*",
              "https://*.frankerfacez.com/*",
              "https://*.streamelements.com/*",
            ]
          : undefined,
    };
  },
});
