import EmoteButton from "@/lib/components/app/EmoteButton.svelte";
import { waitForElement } from "@/lib/helpers";
import { mount, unmount } from "svelte";
import "~/assets/tailwind.css";

const attachedClass = "ftv-emotes-attached";

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
          elem.tagName !== "APP-CHAT-ROOM" ||
          elem.classList.contains(attachedClass)
        ) {
          return;
        }

        elem.classList.add(attachedClass);

        const chatContainer = await waitForElement(
          "app-chat-room > * .chat-container"
        );
        if (!chatContainer) {
          console.error("Could not find scroll container");
          return;
        }

        const chatInputElements = document.querySelectorAll(
          "app-chat-room > .chat-footer > *"
        );
        if (!chatInputElements || chatInputElements.length === 0) {
          console.error("Could not find chat input container");
          return;
        }

        const chatInput = chatInputElements[chatInputElements.length - 1];
        if (!chatInput) {
          console.error("Could not find chat input");
          return;
        }

        const ui = await createShadowRootUi(ctx, {
          name: "ftv-emotes-ui",
          position: "inline",
          append: "last",
          anchor: chatInput,
          onMount: (container) => {
            const app = mount(EmoteButton, {
              target: container,
              props: {
                siteDocument: document,
                siteWindow: window,
                siteLocalStorage: localStorage,
              },
            });
            return app;
          },
          onRemove: (app) => {
            // @ts-ignore https://svelte-5-preview.vercel.app/docs/breaking-changes
            unmount(app);
          },
        });

        ui.mount();
      });
    }).observe(document.body, { childList: true, subtree: true });
  },
});
