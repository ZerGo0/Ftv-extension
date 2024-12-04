import { mount, unmount } from "svelte";
import EmoteMenuButton from "../components/app/EmoteMenuButton.svelte";

const attachedClass = "ftv-emotes-attached";

export async function emoteMenuButton(ctx: any, mutation: MutationRecord) {
  const element = mutation.target as HTMLElement;
  if (!element || !element.tagName || element.tagName !== "APP-CHAT-ROOM") {
    return;
  }

  const chatInputElements = element.querySelectorAll(
    "app-chat-room > .chat-footer > *",
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
    onRemove: (app: any) => {
      unmount(app);
    },
  });

  ui.uiContainer.classList.add("dark");
  ui.mount();
}
