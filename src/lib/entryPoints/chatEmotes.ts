import { emoteStore } from '../emotes/emotes.svelte';
import { Emote } from '../types';
import { findChatContainer } from '../utils/chatDom';
import { findElementFromMutation } from '../utils/findElementFromMutation';
import { observeSerializedMutations } from '../utils/observeSerializedMutations';

const attachedClass = 'ftv-chat-emotes-attached';
const bootstrapChunkSize = 25;
const bootstrapMessageLimit = 120;
let emoteStoreReadyPromise: Promise<void> | null = null;

export function chatEmotes(ctx: any, mutation: MutationRecord) {
  const chatRoomElement = findElementFromMutation(mutation, 'app-chat-room');
  if (!chatRoomElement) {
    return;
  }

  const chatContainer = findChatContainer(chatRoomElement);
  if (!chatContainer) {
    return;
  }

  if (chatContainer.classList.contains(attachedClass)) {
    return;
  }

  chatContainer.classList.add(attachedClass);

  observeSerializedMutations({
    target: chatContainer,
    config: {
      childList: true
    },
    processMutation: async (chatMutation) => {
      await chatMessageHandler(chatMutation);
    },
    onError: (error) => {
      console.error('chatEmotes mutation queue failed', error);
    }
  });

  void bootstrapExistingChatMessages(chatContainer);
}

async function chatMessageHandler(mutation: MutationRecord) {
  await waitForEmoteStore();

  if (mutation.type !== 'childList') {
    return;
  }

  for (const node of mutation.addedNodes) {
    parseChatMessageNode(node);
  }
}

async function waitForEmoteStore() {
  if (emoteStore.ready) {
    return;
  }

  if (!emoteStoreReadyPromise) {
    emoteStoreReadyPromise = new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (emoteStore.ready) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    }).finally(() => {
      emoteStoreReadyPromise = null;
    });
  }

  await emoteStoreReadyPromise;
}

async function bootstrapExistingChatMessages(chatContainer: Element) {
  await waitForEmoteStore();

  const existingMessages = Array.from(chatContainer.querySelectorAll('app-chat-room-message'));
  if (existingMessages.length === 0) {
    return;
  }

  const bootstrapMessages = existingMessages.slice(
    Math.max(0, existingMessages.length - bootstrapMessageLimit)
  );

  let index = 0;
  const processChunk = () => {
    const maxIndex = Math.min(index + bootstrapChunkSize, bootstrapMessages.length);
    for (; index < maxIndex; index += 1) {
      parseChatMessageNode(bootstrapMessages[index]);
    }

    if (index < bootstrapMessages.length) {
      requestAnimationFrame(processChunk);
    }
  };

  processChunk();
}

function maybeReplaceMessageText(messageElement: HTMLElement, elementTextSplit: string[]) {
  const nextHtml = elementTextSplit.join('');
  if (messageElement.innerHTML === nextHtml) {
    return;
  }

  messageElement.innerHTML = nextHtml;
}

function parseChatMessageNode(node: Node) {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const element = node as HTMLElement;
  if (element.tagName !== 'APP-CHAT-ROOM-MESSAGE') {
    return;
  }

  // Find all message-text spans inside the nested structure
  const messageTextElements = element.querySelectorAll('.message-text');
  if (!messageTextElements || messageTextElements.length === 0) {
    console.warn('Could not get message');
    return;
  }

  const messageNodes = Array.from(messageTextElements);

  for (const messageNode of messageNodes) {
    if (messageNode.nodeType !== Node.ELEMENT_NODE || !messageNode.textContent) {
      continue;
    }

    const messageElement = messageNode as HTMLElement;
    if (!messageElement) {
      continue;
    }

    let elementTextSplit = prepareTextSplit(messageNode.textContent!);

    const emotePositions = getEmotes(elementTextSplit);
    if (emotePositions.length === 0) {
      continue;
    }

    for (const { idx, emote } of emotePositions) {
      const emoteHtml = prepareEmoteHtml(emote);
      elementTextSplit[idx] = emoteHtml;
    }

    maybeReplaceMessageText(messageElement, elementTextSplit);
  }
}

function prepareTextSplit(elementText: string): string[] {
  let elementTextSplit = [];
  let currentWord = '';
  for (let i = 0; i < elementText.length; i++) {
    const currentChar = elementText[i];

    // Check if current character is a line break
    if (currentChar === '\n') {
      // Push current word if it exists
      if (currentWord.length > 0) {
        elementTextSplit.push(currentWord);
        currentWord = '';
      }
      // Push the line break as its own element
      elementTextSplit.push(currentChar);
      continue;
    }

    currentWord += currentChar;

    if (elementText.length - 1 === i) {
      // last character
      elementTextSplit.push(currentWord);
      currentWord = '';
      continue;
    }

    const nextChar = elementText[i + 1];

    if (currentChar === ' ' && nextChar !== ' ') {
      // currentWord contains space right now,
      // but next character is not a space
      elementTextSplit.push(currentWord);
      currentWord = '';
      continue;
    }

    if (currentChar !== ' ' && nextChar === ' ') {
      // currentWord does not contain space right now,
      // but next character is a space
      elementTextSplit.push(currentWord);
      currentWord = '';
      continue;
    }
  }

  return elementTextSplit;
}

function getEmotes(elementTextSplit: string[]): Array<{ idx: number; emote: Emote }> {
  const emotePositions: Array<{ idx: number; emote: Emote }> = [];

  for (let i = 0; i < elementTextSplit.length; i++) {
    const word = elementTextSplit[i];

    if (word.length === 0 || word[0] === ' ' || word === '\n') {
      continue;
    }

    const emote = emoteStore.emotes.find((emote) => emote.name === word);

    if (emote === undefined) {
      continue;
    }

    emotePositions.push({ idx: i, emote });
  }

  return emotePositions;
}

function prepareEmoteHtml(emote: Emote): string {
  const emoteContElement = document.createElement('div');
  emoteContElement.id = 'emote-container';
  emoteContElement.className = 'emote-container';
  emoteContElement.style.display = 'inline-block';
  emoteContElement.title = emote.name;

  const emoteImgElement = document.createElement('img');
  emoteImgElement.id = 'emote';
  emoteImgElement.className = 'emote';
  emoteImgElement.loading = 'lazy';
  emoteImgElement.src = emote.url;
  emoteImgElement.title = emote.name;
  emoteImgElement.alt = emote.name;
  emoteImgElement.style.maxHeight = '32px';

  emoteContElement.appendChild(emoteImgElement);

  return emoteContElement.outerHTML;
}
