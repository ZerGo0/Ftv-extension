import { mount } from "svelte";
import EmoteButton from "../components/app/EmoteButton.svelte";

const attachedClass = "ftv-emotes-attached";

export async function emoteButton(ctx: any, mutation: MutationRecord) {
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

  if (chatInput.classList.contains(attachedClass)) {
    return;
  }

  chatInput.classList.add(attachedClass);

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

  ui.uiContainer.classList.add("dark");
  ui.mount();
}
