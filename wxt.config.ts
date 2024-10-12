import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-svelte"],
  runner: {
    chromiumArgs: ["--user-data-dir=./private/.dev-profile"],
    startUrls: ["https://fansly.com/live/zergo0_bot"],
  },
});
