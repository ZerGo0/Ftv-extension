import badgesCss from '@/assets/badges.css?inline';
import userpaintCss from '@/assets/userpaint.css?inline';
import { mount } from 'svelte';
import { zergo0Api } from '../api/zergo0';
import ZerGo0BotSubBadge from '../components/ui/badges/ZerGo0BotSubBadge.svelte';
import { sharedState } from '../state/state.svelte';
import { ZerGo0Badge, ZerGo0UsernamePaint } from '../types';
import { usernamesCache } from './chatUsernameAutoComplete';

const attachedClass = 'ftv-pronouns-attached';

export function accountCard(ctx: any, mutation: MutationRecord) {
  const element = mutation.target as HTMLElement;
  if (!element || !element.tagName || element.tagName !== 'APP-CHAT-ROOM') {
    return;
  }

  const chatContainer = element.querySelector('app-chat-room > * .chat-container');
  if (!chatContainer) {
    return;
  }

  if (chatContainer.classList.contains(attachedClass)) {
    return;
  }

  chatContainer.classList.add(attachedClass);

  new MutationObserver(async (mutations) => await chatMessageHandler(mutations)).observe(
    chatContainer,
    {
      childList: true
    }
  );
}

async function chatMessageHandler(mutations: MutationRecord[]) {
  mutations.forEach((mutation) => {
    if (mutation.type !== 'childList') {
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
  if (element.tagName !== 'APP-CHAT-ROOM-MESSAGE') {
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

  const chatroomId = sharedState.chatroomId;
  if (!chatroomId) {
    return;
  }

  // Apply username paint to the element itself
  zergo0Api.getUsernamePaint(chatroomId, usernameLower).then((usernamePaint) => {
    setUsernamePaint(element, usernamePaint);
  });

  // Get the parent node to insert siblings
  const parent = element.parentNode;
  if (!parent) {
    return;
  }

  // Add badges before the username element
  zergo0Api.getUserBadges(usernameLower).then((badges) => {
    badges.forEach((badge) => {
      prependBadge(parent, badge, element);
    });
  });

  // Add pronouns after the username element
  zergo0Api.getUserPronouns(usernameLower).then((pronouns) => {
    if (pronouns && pronouns.length > 0) {
      appendPronouns(parent, pronouns, element);
    }
  });
}

function appendPronouns(parent: Node, pronouns: string, afterElement: HTMLElement) {
  const pronounsText = document.createElement('span');
  pronounsText.style.color = 'gray';
  pronounsText.style.fontSize = '10px';
  pronounsText.style.fontWeight = 'bold';
  pronounsText.style.marginLeft = '5px';
  pronounsText.textContent = pronouns;
  pronounsText.title = "User's pronouns";

  // Insert after the username element
  if (afterElement.nextSibling) {
    parent.insertBefore(pronounsText, afterElement.nextSibling);
  } else {
    parent.appendChild(pronounsText);
  }
}

function prependBadge(parent: Node, badge: ZerGo0Badge, beforeElement: HTMLElement) {
  if (badge.type.startsWith('sub_badge')) {
    // append "badges.css" to the head if it's not already there
    const head = document.head;
    if (!head.querySelector('style#ftv-badges-css')) {
      const style = document.createElement('style');
      style.id = 'ftv-badges-css';
      style.media = 'screen';
      style.innerHTML = badgesCss;
      document.head.appendChild(style);
    }

    // Create a container for the badge
    const badgeContainer = document.createElement('span');
    badgeContainer.style.marginRight = '0.25rem';
    badgeContainer.style.display = 'inline-flex';
    badgeContainer.style.alignItems = 'center';

    // Insert the badge container before the username element
    parent.insertBefore(badgeContainer, beforeElement);

    mount(ZerGo0BotSubBadge, {
      target: badgeContainer,
      props: {
        badge
      }
    });
  }
}

function setUsernamePaint(element: HTMLElement, usernamePaint: ZerGo0UsernamePaint | null) {
  if (!usernamePaint) {
    return;
  }

  const design = usernamePaintDesigns.find((design) => design.id === usernamePaint.usernamePaintId);

  if (!design) {
    return;
  }

  // append "userpaint.css" to the head if it's not already there
  const head = document.head;
  if (!head.querySelector('style#ftv-userpaint-css')) {
    const style = document.createElement('style');
    style.id = 'ftv-userpaint-css';
    style.media = 'screen';
    style.innerHTML = userpaintCss;
    document.head.appendChild(style);
  }

  element.classList.add('userpaints-' + design.class);
  element.classList.add('userpaints-' + design.textClass);

  if (design.gif) {
    const img = document.createElement('img');
    img.src = 'https://zergo0botcdn.zergo0.dev/assets/' + design.gif + '.gif';
    img.alt = 'Username paint effect';
    img.classList.add('userpaints-effect-overlay');
    element.appendChild(img);
  }
}

export const usernamePaintDesigns = [
  { id: 0, name: 'None', class: '' },
  { id: 1, name: 'Rainbow Wave', class: 'rainbow-wave' },
  { id: 2, name: 'Fire Gradient', class: 'fire-gradient' },
  { id: 3, name: 'Ocean Depths', class: 'ocean-depths' },
  { id: 4, name: 'Sunset Sky', class: 'sunset-sky' },
  { id: 5, name: 'Aurora Borealis', class: 'aurora-borealis' },
  { id: 6, name: 'Iridescent Sheen', class: 'iridescent-sheen' },
  { id: 7, name: 'Metallic Foil', class: 'metallic-foil' },
  { id: 8, name: 'Pearlescent', class: 'pearlescent' },
  { id: 9, name: 'Opal Shimmer', class: 'opal-shimmer' },
  { id: 10, name: 'Lava Flow', class: 'lava-flow' },
  { id: 11, name: 'Neon Ink', class: 'neon-ink' },
  { id: 12, name: 'Digital Matrix', class: 'digital-matrix' },
  {
    id: 13,
    name: 'Sparkle Effect',
    class: 'sparkle-effect',
    gif: 'effect1',
    textClass: 'sparkle-text'
  },
  {
    id: 14,
    name: 'Electric Sparks',
    class: 'electric-sparks',
    gif: 'effect2',
    textClass: 'electric-text'
  },
  {
    id: 15,
    name: 'Glitter Shine',
    class: 'glitter-shine',
    gif: 'effect3',
    textClass: 'glitter-text'
  },
  {
    id: 16,
    name: 'Falling Hearts',
    class: 'falling-hearts',
    gif: 'effect4',
    textClass: 'hearts-text'
  },
  {
    id: 17,
    name: 'Heart Rain',
    class: 'heart-rain',
    gif: 'effect5',
    textClass: 'heart-rain-text'
  },
  { id: 18, name: 'Retro Synthwave', class: 'retro-synthwave' },
  { id: 19, name: 'Glitch Wave', class: 'glitch-wave' },
  { id: 20, name: 'Duotone Split', class: 'duotone-split' },
  { id: 21, name: 'Thermal Vision', class: 'thermal-vision' },
  { id: 22, name: 'Gradient Shift', class: 'gradient-shift' },
  { id: 23, name: 'Neon Outline', class: 'neon-outline' },
  { id: 24, name: 'Magic Shimmer', class: 'magic-shimmer' },
  { id: 25, name: 'Sakura Blossom', class: 'sakura-blossom' },
  { id: 26, name: 'Kawaii Dream', class: 'kawaii-dream' },
  { id: 27, name: 'Candy Cane', class: 'candy-cane' },
  { id: 28, name: 'Gothic Rose', class: 'gothic-rose' },
  { id: 29, name: 'Pastel Princess', class: 'pastel-princess' },
  { id: 30, name: 'Dark Academia', class: 'dark-academia' },
  { id: 31, name: 'Twitch Purple', class: 'twitch-purple' },
  { id: 32, name: 'E-Girl Aesthetic', class: 'egirl-aesthetic' },
  { id: 33, name: 'Soft Grunge', class: 'soft-grunge' },
  { id: 34, name: 'Streamer Vibes', class: 'streamer-vibes' }
];
