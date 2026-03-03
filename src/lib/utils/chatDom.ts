export function findChatContainer(chatRoomElement: Element): Element | null {
  const nestedContainer = chatRoomElement.querySelector('app-chat-room > * .chat-container');
  if (nestedContainer) {
    return nestedContainer;
  }

  return chatRoomElement.querySelector('.chat-container');
}

export function findChatInput(chatRoomElement: Element): HTMLTextAreaElement | null {
  const nestedInput = chatRoomElement.querySelector(
    'app-chat-room > .chat-footer > * > .message-input-container > textarea'
  );
  if (nestedInput instanceof HTMLTextAreaElement) {
    return nestedInput;
  }

  const fallbackInput = chatRoomElement.querySelector(
    '.chat-footer .message-input-container > textarea'
  );
  if (fallbackInput instanceof HTMLTextAreaElement) {
    return fallbackInput;
  }

  return null;
}

export function findChatFooterItems(chatRoomElement: Element): Element[] {
  const nestedItems = chatRoomElement.querySelectorAll('app-chat-room > .chat-footer > *');
  if (nestedItems.length > 0) {
    return Array.from(nestedItems);
  }

  return Array.from(chatRoomElement.querySelectorAll('.chat-footer > *'));
}
