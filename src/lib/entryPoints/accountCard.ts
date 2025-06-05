import { usernamesCache } from "./chatUsernameAutoComplete";

export const pronounsCache = new Map<string, Promise<string>>();

const attachedClass = "ftv-pronouns-attached";

export function accountCard(ctx: any, mutation: MutationRecord) {
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
  mutations.forEach((mutation) => {
    if (mutation.type !== "childList") {
      return;
    }

    mutation.addedNodes.forEach((node) => {
      parseChatMessageNode(node);
    });
  });
}

function parseChatMessageNode(node: Node) {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const element = node as HTMLElement;
  if (element.tagName !== "APP-CHAT-ROOM-MESSAGE") {
    return;
  }

  // Look for the username element with appaccountcard attribute in the new structure
  const usernameElement = element.querySelector('[appaccountcard]');
  if (usernameElement && usernameElement instanceof HTMLElement) {
    handleAccountCard(usernameElement);
  }
}

function handleAccountCard(element: HTMLElement) {
  const username = element.innerText.trim();
  if (username.length === 0) {
    return;
  }

  const usernameLower = username.toLowerCase();

  if (!usernamesCache.has(usernameLower)) {
    usernamesCache.set(usernameLower, username);
  }

  getAccountPronounsFromCache(usernameLower).then((pronouns) => {
    if (pronouns && pronouns.length > 0) {
      appendPronouns(element, pronouns);
    }
  });
}

async function getAccountPronounsFromCache(username: string): Promise<string> {
  if (pronounsCache.has(username)) {
    return pronounsCache.get(username) as Promise<string>;
  }

  const pronouns = getAccountPronouns(username);
  pronounsCache.set(username, pronouns);

  return pronouns;
}

async function getAccountPronouns(username: string): Promise<string> {
  const resp = await fetch(
    `https://zergo0_bot.zergo0.dev/ftv/pronouns/user/${username}`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
      },
      method: "GET",
    },
  );

  if (!resp.ok) {
    console.warn("Account request failed", resp);
    return "";
  }

  return await resp.text();
}

function appendPronouns(element: HTMLElement, pronouns: string) {
  element.style.display = "inline-flex";
  element.style.alignItems = "center";
  element.style.flexDirection = "row";

  const pronounsText = document.createElement("div");
  pronounsText.style.marginLeft = "5px";
  pronounsText.style.color = "gray";
  pronounsText.style.fontSize = "10px";
  pronounsText.style.fontWeight = "bold";
  pronounsText.style.display = "inline-block";
  pronounsText.textContent = pronouns;
  pronounsText.title = "User's pronouns";
  element.appendChild(pronounsText);
}
