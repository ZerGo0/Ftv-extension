import { mount } from "svelte";
import EmoteMenuButton from "../components/app/EmoteMenuButton.svelte";

const attachedClass = "ftv-emotes-attached";

export async function emoteMenuButton(ctx: any) {
  const chatInputElements = document.querySelectorAll(
    "app-chat-room > .chat-footer > *"
  );
  if (!chatInputElements || chatInputElements.length === 0) {
    return;
  }

  const chatInput = chatInputElements[chatInputElements.length - 1];
  if (!chatInput) {
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
      const app = mount(EmoteMenuButton, {
        target: container,
        props: {},
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
