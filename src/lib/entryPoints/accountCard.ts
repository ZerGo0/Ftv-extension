import badgesCss from "@/assets/badges.css?inline";
import { mount } from "svelte";
import { zergo0Api } from "../api/zergo0";
import ZerGo0BotSubBadge from "../components/ui/badges/ZerGo0BotSubBadge.svelte";
import { ZerGo0Badge } from "../types";
import { usernamesCache } from "./chatUsernameAutoComplete";

const attachedClass = "ftv-pronouns-attached";

export function accountCard(ctx: any, mutation: MutationRecord) {
  const element = mutation.target as HTMLElement;
  if (!element || !element.tagName || element.tagName !== "APP-CHAT-ROOM") {
    return;
  }

  const chatContainer = element.querySelector(
    "app-chat-room > * .chat-container"
  );
  if (!chatContainer) {
    return;
  }

  if (chatContainer.classList.contains(attachedClass)) {
    return;
  }

  chatContainer.classList.add(attachedClass);

  new MutationObserver(
    async (mutations) => await chatMessageHandler(mutations)
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
  const usernameElement = element.querySelector("[appaccountcard]");
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

  zergo0Api.getUsernamePaint(usernameLower).then((usernamePaint) => {
    console.log("usernamePaint", usernamePaint);
  });

  zergo0Api.getUserBadges(usernameLower).then((badges) => {
    badges.forEach((badge) => {
      prependBadge(element, badge);
    });
  });

  zergo0Api.getUserPronouns(usernameLower).then((pronouns) => {
    if (pronouns && pronouns.length > 0) {
      appendPronouns(element, pronouns);
    }
  });
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

function prependBadge(element: HTMLElement, badge: ZerGo0Badge) {
  element.style.display = "inline-flex";
  element.style.alignItems = "center";
  element.style.flexDirection = "row";

  if (badge.type.startsWith("sub_badge")) {
    // append "badges.css" to the head if it's not already there
    const head = document.head;
    if (!head.querySelector("style#ftv-badges-css")) {
      const style = document.createElement("style");
      style.id = "ftv-badges-css";
      style.media = "screen";
      style.innerHTML = badgesCss;
      document.head.appendChild(style);
    }

    mount(ZerGo0BotSubBadge, {
      target: element,
      anchor: element.firstChild as Node,
      props: {
        badge,
      },
    });
  }
}
