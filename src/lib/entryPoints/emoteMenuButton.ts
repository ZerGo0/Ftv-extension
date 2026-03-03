import { mount, unmount } from 'svelte';
import EmoteMenuButton from '../components/app/EmoteMenuButton.svelte';
import { findChatFooterItems } from '../utils/chatDom';
import { findElementFromMutation } from '../utils/findElementFromMutation';

const attachedClass = 'ftv-emotes-attached';

export async function emoteMenuButton(ctx: any, mutation: MutationRecord) {
  const chatRoomElement = findElementFromMutation(mutation, 'app-chat-room');
  if (!chatRoomElement) {
    return;
  }

  const chatInputElements = findChatFooterItems(chatRoomElement);
  if (chatInputElements.length === 0) {
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
    name: 'ftv-emotes-ui',
    position: 'inline',
    append: 'last',
    anchor: chatInput,
    onMount: (container) => {
      const app = mount(EmoteMenuButton, {
        target: container,
        props: {}
      });
      return app;
    },
    onRemove: (app: any) => {
      unmount(app);
    }
  });

  ui.uiContainer.classList.add('dark');
  ui.mount();
}
