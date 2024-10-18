import { emoteStore } from "../emotes/emotes.svelte";

const attachedClass = "ftv-chat-emotes-attached";

export function chatEmotes() {
  const chatContainer = document.querySelector(
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

  const messageElements = textNodes.slice(1);
  if (!messageElements || messageElements.length === 0) {
    console.error("Could not get message");
    return;
  }

  messageElements.forEach((messageElement: any) => {
    if (messageElement.nodeType === Node.ELEMENT_NODE) {
      messageElement.data = messageElement.textContent;
    }

    parseEmotes(messageElement.data, " ").then((chatMsgElements: any) => {
      if (!chatMsgElements || chatMsgElements.length === 0) {
        return;
      }

      messageElement.replaceWith(...chatMsgElements);
    });
  });
}

// FIXME: "test https://example.com" becomes "test  https://example.com" (2 spaces)
// FIXME: the last word always has a trailing space
async function parseEmotes(
  message: string,
  emoteSeparator: string,
): Promise<(HTMLDivElement | Text)[]> {
  const chatMsgElements = [];
  const messageSplit = message.split(emoteSeparator);

  for (let i = 0; i < messageSplit.length; i++) {
    const word = messageSplit[i];

    if (word.length === 0) {
      appendSeparator(chatMsgElements, word, emoteSeparator);
      continue;
    }

    const wordLower = word.toLocaleLowerCase();
    const emote = emoteStore.emotes.find(
      (emote) => emote.nameLower === wordLower,
    );

    if (emote === undefined) {
      appendSeparator(chatMsgElements, word, emoteSeparator);
      continue;
    }

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

    chatMsgElements.push(emoteContElement);
    chatMsgElements.push(document.createTextNode(emoteSeparator));
  }

  return chatMsgElements;
}

function appendSeparator(
  chatMsgElements: any[],
  word: string,
  selector: string,
): void {
  if (
    chatMsgElements.length > 0 &&
    chatMsgElements[chatMsgElements.length - 1].nodeType === Node.TEXT_NODE
  ) {
    chatMsgElements[chatMsgElements.length - 1].textContent += word + selector;
    return;
  }

  chatMsgElements.push(document.createTextNode(word + selector));
}
