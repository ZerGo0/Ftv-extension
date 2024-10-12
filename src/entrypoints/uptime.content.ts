import "~/assets/tailwind.css";
import Uptime from "../lib/components/app/Uptime.svelte";

export default defineContentScript({
  matches: ["*://*.fansly.com/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    // This needs to be a MutationObserver because of client-side routing
    // When a user navigates to a new page, the actual page is not reloaded
    new MutationObserver(async (mutations) => {
      mutations.forEach(async (mutation) => {
        const elem = mutation.target as HTMLElement;
        if (
          !elem ||
          // TODO: find more unique selector
          !elem.classList.contains("stream-info") ||
          elem.classList.contains("ftv-uptime-attached")
        ) {
          return;
        }

        const ui = await createShadowRootUi(ctx, {
          name: "ftv-uptime-ui",
          position: "inline",
          append: "last",
          anchor: elem,
          onMount: (container) => {
            const app = new Uptime({
              target: container,
              props: {
                // siteDocument: document,
                // siteWindow: window,
                siteLocalStorage: localStorage,
              },
            });

            elem.classList.add("ftv-uptime-attached");
            return app;
          },
          onRemove: (app) => {
            app?.$destroy();
          },
        });

        ui.mount();
      });
    }).observe(document.body, { childList: true, subtree: true });
  },
});
