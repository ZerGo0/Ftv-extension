import EmoteSuggestionsContainer from "@/lib/components/ui/emote/EmoteSuggestionsContainer.svelte";
import { mount, unmount } from "svelte";

const attachedClass = "ftv-emote-suggestions-attached";

export async function emoteSuggestions(ctx: any, mutation: MutationRecord) {
  const element = mutation.target as HTMLElement;
  if (!element || !element.tagName || element.tagName !== "APP-CHAT-ROOM") {
    return;
  }

  const chatInput = element.querySelector(
    "app-chat-room > .chat-footer > * > .message-input-container > textarea"
  ) as HTMLTextAreaElement;

  if (!chatInput || chatInput.classList.contains(attachedClass)) {
    return;
  }

  chatInput.classList.add(attachedClass);

  // Get the message input container for positioning
  const messageInputContainer = chatInput.closest(".message-input-container");
  if (!messageInputContainer || !messageInputContainer.parentElement) {
    return;
  }

  // Create shadow root UI
  const ui = await createShadowRootUi(ctx, {
    name: "ftv-emote-suggestions",
    position: "inline",
    append: "first",
    anchor: messageInputContainer.parentElement,
    onMount: (container) => {
      // Mount the container component
      const app = mount(EmoteSuggestionsContainer, {
        target: container,
        props: {
          chatInput,
        },
      });
      return app;
    },
    onRemove: (app: any) => {
      unmount(app);
    },
  });

  ui.uiContainer.classList.add("dark");
  ui.uiContainer.style.position = "relative";
  ui.mount();

  // Clean up when input is removed
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        for (const removedNode of mutation.removedNodes) {
          if (
            removedNode === chatInput ||
            (removedNode as HTMLElement).contains?.(chatInput)
          ) {
            ui.remove();
            observer.disconnect();
            return;
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
