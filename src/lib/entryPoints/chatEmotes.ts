import { emoteStore } from "../emotes/emotes.svelte";
import { Emote } from "../types";

const attachedClass = "ftv-chat-emotes-attached";

export function chatEmotes(ctx: any, mutation: MutationRecord) {
  const element = mutation.target as HTMLElement;
  if (!element || !element.tagName || element.tagName !== "APP-CHAT-ROOM") {
    return;
  }

  const chatContainer = element.querySelector(
    "app-chat-room > * .chat-container",
  );
  if (!chatContainer) {
    return;
  }

  if (chatContainer.classList.contains(attachedClass)) {
    return;
  }

  chatContainer.classList.add(attachedClass);

  new MutationObserver(
    async (mutations) => await chatMessageHandler(mutations),
  ).observe(chatContainer, {
    childList: true,
  });
}

async function chatMessageHandler(mutations: MutationRecord[]) {
  // wait until emoteStore is populated asynchonously
  await waitForEmoteStore();

  mutations.forEach((mutation) => {
    if (mutation.type !== "childList") {
      return;
    }

    mutation.addedNodes.forEach((node) => {
      parseChatMessageNode(node);
    });
  });
}

async function waitForEmoteStore() {
  if (emoteStore.emotes.length > 0) {
    return;
  }

  const initializedPromise = new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (emoteStore.emotes.length > 0) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });

  await initializedPromise;
}

function parseChatMessageNode(node: Node) {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const element = node as HTMLElement;
  if (element.tagName !== "APP-CHAT-ROOM-MESSAGE") {
    return;
  }

  const textNodes: ChildNode[] = [];
  element.childNodes.forEach(async (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const childElement = node as HTMLElement;
      if (childElement.classList.contains("message-text")) {
        textNodes.push(childElement);
      }
    }
  });

  const messageNodes = textNodes.slice(1); // the first text node is " : "
  if (!messageNodes || messageNodes.length === 0) {
    console.warn("Could not get message");
    return;
  }

  for (const messageNode of messageNodes) {
    if (
      messageNode.nodeType !== Node.ELEMENT_NODE ||
      !messageNode.textContent
    ) {
      return;
    }

    const messageElement = messageNode as HTMLElement;
    if (!messageElement) {
      return;
    }

    let elementTextSplit = prepareTextSplit(messageNode.textContent!);

    const emotePositions = getEmotes(elementTextSplit);
    if (emotePositions.length === 0) {
      return;
    }

    for (const { idx, emote } of emotePositions) {
      const emoteHtml = prepareEmoteHtml(emote);
      elementTextSplit[idx] = emoteHtml;
    }

    messageElement.innerHTML = elementTextSplit.join("");
  }
}

function prepareTextSplit(elementText: string): string[] {
  let elementTextSplit = [];
  let currentWord = "";
  for (let i = 0; i < elementText.length; i++) {
    const currentChar = elementText[i];
    currentWord += currentChar;

    if (elementText.length - 1 === i) {
      // last character
      elementTextSplit.push(currentWord);
      currentWord = "";
      continue;
    }

    const nextChar = elementText[i + 1];

    if (currentChar === " " && nextChar !== " ") {
      // currentWord contains space right now,
      // but next character is not a space
      elementTextSplit.push(currentWord);
      currentWord = "";
      continue;
    }

    if (currentChar !== " " && nextChar === " ") {
      // currentWord does not contain space right now,
      // but next character is a space
      elementTextSplit.push(currentWord);
      currentWord = "";
      continue;
    }
  }

  return elementTextSplit;
}

function getEmotes(
  elementTextSplit: string[],
): Array<{ idx: number; emote: Emote }> {
  const emotePositions: Array<{ idx: number; emote: Emote }> = [];

  for (let i = 0; i < elementTextSplit.length; i++) {
    const word = elementTextSplit[i];

    if (word.length === 0 || word[0] === " ") {
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
  const emoteContElement = document.createElement("div");
  emoteContElement.id = "emote-container";
  emoteContElement.className = "emote-container";
  emoteContElement.style.display = "inline-block";
  emoteContElement.title = emote.name;

  const emoteImgElement = document.createElement("img");
  emoteImgElement.id = "emote";
  emoteImgElement.className = "emote";
  emoteImgElement.loading = "lazy";
  emoteImgElement.src = emote.url;
  emoteImgElement.title = emote.name;
  emoteImgElement.alt = emote.name;

  emoteContElement.appendChild(emoteImgElement);

  return emoteContElement.outerHTML;
}
