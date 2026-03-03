import badgesCss from '@/assets/badges.css?inline';
import userpaintCss from '@/assets/userpaint.css?inline';
import { zergo0Api } from '../api/zergo0';
import { sharedState } from '../state/state.svelte';
import { ZerGo0Badge, ZerGo0UsernamePaint } from '../types';
import { findChatContainer } from '../utils/chatDom';
import { findElementFromMutation } from '../utils/findElementFromMutation';
import { observeSerializedMutations } from '../utils/observeSerializedMutations';
import { usernamesCache } from './chatUsernameAutoComplete';

const attachedClass = 'ftv-pronouns-attached';
const entryAttachedClass = 'ftv-pronouns-entry-attached';
const bootstrapChunkSize = 25;
const bootstrapMessageLimit = 120;
const chatDecorationAnimationsEnabled =
  localStorage.getItem('ftv-chat-decorations-animations') !== 'false';
const decorationManagedMessageClass = 'ftv-decoration-managed';
const decorationPausedMessageClass = 'ftv-decoration-paused';
const decorationViewportMarginPx = 900;
const badgeSizeMap: { [key: string]: number } = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28
};
const badgeSize = badgeSizeMap.md ?? 16;

let badgesCssInjected = false;
let userpaintCssInjected = false;
let decorationPerformanceCssInjected = false;
let activeChatContainer: HTMLElement | null = null;
let managedDecoratedMessages = new Set<HTMLElement>();
let decorationVisibilityObserver: IntersectionObserver | null = null;

type UserDecorations = {
  badges: ZerGo0Badge[];
  pronouns: string;
  usernamePaint: ZerGo0UsernamePaint | null;
};

const userDecorationsCache = new Map<string, Promise<UserDecorations>>();

export function accountCard(ctx: any, mutation: MutationRecord) {
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
  userDecorationsCache.clear();

  if (chatContainer instanceof HTMLElement) {
    setupDecorationAnimationManagement(chatContainer);
  }

  observeSerializedMutations({
    target: chatContainer,
    config: {
      childList: true
    },
    processMutation: (chatMutation) => {
      chatMessageHandler(chatMutation);
    },
    onError: (error) => {
      console.error('accountCard mutation queue failed', error);
    }
  });

  bootstrapExistingChatMessages(chatContainer);
}

function setupDecorationAnimationManagement(chatContainer: HTMLElement) {
  if (decorationVisibilityObserver) {
    decorationVisibilityObserver.disconnect();
    decorationVisibilityObserver = null;
  }

  activeChatContainer = chatContainer;
  managedDecoratedMessages.clear();

  if (!chatDecorationAnimationsEnabled) {
    return;
  }

  ensureDecorationPerformanceCssInjected();

  decorationVisibilityObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const messageElement = entry.target;
        if (!(messageElement instanceof HTMLElement)) {
          continue;
        }

        if (!messageElement.isConnected) {
          decorationVisibilityObserver?.unobserve(messageElement);
          managedDecoratedMessages.delete(messageElement);
          continue;
        }

        const isVisible =
          entry.isIntersecting &&
          entry.intersectionRect.height > 0 &&
          entry.intersectionRect.width > 0;
        messageElement.classList.toggle(decorationPausedMessageClass, !isVisible);
      }
    },
    {
      root: chatContainer,
      rootMargin: `${decorationViewportMarginPx}px 0px ${decorationViewportMarginPx}px 0px`,
      threshold: 0
    }
  );
}

function ensureDecorationPerformanceCssInjected() {
  if (decorationPerformanceCssInjected) {
    return;
  }

  const head = document.head;
  if (head.querySelector('style#ftv-decoration-performance-css')) {
    decorationPerformanceCssInjected = true;
    return;
  }

  const style = document.createElement('style');
  style.id = 'ftv-decoration-performance-css';
  style.media = 'screen';
  style.innerHTML = `
    .${decorationManagedMessageClass}.${decorationPausedMessageClass} .badge-item,
    .${decorationManagedMessageClass}.${decorationPausedMessageClass} .badge-item *,
    .${decorationManagedMessageClass}.${decorationPausedMessageClass} .badge-item::before,
    .${decorationManagedMessageClass}.${decorationPausedMessageClass} .badge-item::after,
    .${decorationManagedMessageClass}.${decorationPausedMessageClass} [class*='userpaints-'],
    .${decorationManagedMessageClass}.${decorationPausedMessageClass} [class*='userpaints-'] *,
    .${decorationManagedMessageClass}.${decorationPausedMessageClass} [class*='userpaints-']::before,
    .${decorationManagedMessageClass}.${decorationPausedMessageClass} [class*='userpaints-']::after {
      animation-play-state: paused !important;
      transition: none !important;
      filter: none !important;
    }

    .${decorationManagedMessageClass}.${decorationPausedMessageClass} .userpaints-effect-overlay {
      visibility: hidden !important;
    }
  `;
  head.appendChild(style);
  decorationPerformanceCssInjected = true;
}

function chatMessageHandler(mutation: MutationRecord) {
  if (mutation.type !== 'childList') {
    return;
  }

  for (const node of mutation.removedNodes) {
    unregisterDecoratedMessages(node);
  }

  for (const node of mutation.addedNodes) {
    parseChatMessageNode(node);
  }
}

function parseChatMessageNode(node: Node) {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const element = node as HTMLElement;
  if (element.tagName !== 'APP-CHAT-ROOM-MESSAGE') {
    return;
  }

  const usernameElement = element.querySelector('[appaccountcard]');
  if (usernameElement && usernameElement instanceof HTMLElement) {
    handleAccountCard(element, usernameElement);
  }
}

function handleAccountCard(messageElement: HTMLElement, usernameElement: HTMLElement) {
  if (usernameElement.classList.contains(entryAttachedClass)) {
    return;
  }

  const username = (usernameElement.textContent || '').trim();
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

  usernameElement.classList.add(entryAttachedClass);

  void applyDecorations(messageElement, usernameElement, chatroomId, usernameLower);
}

function bootstrapExistingChatMessages(chatContainer: Element) {
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

async function applyDecorations(
  messageElement: HTMLElement,
  usernameElement: HTMLElement,
  chatroomId: string,
  usernameLower: string
) {
  const decorations = await getUserDecorations(chatroomId, usernameLower);
  if (!usernameElement.isConnected || !messageElement.isConnected) {
    return;
  }

  setUsernamePaint(usernameElement, decorations.usernamePaint);

  const parent = usernameElement.parentNode;
  if (!parent) {
    return;
  }

  for (const badge of decorations.badges) {
    prependBadge(parent, badge, usernameElement);
  }

  if (decorations.pronouns && decorations.pronouns.length > 0) {
    appendPronouns(parent, decorations.pronouns, usernameElement);
  }

  if (
    chatDecorationAnimationsEnabled &&
    (decorations.usernamePaint !== null ||
      decorations.badges.some((badge) => badgeHasAnimation(badge)))
  ) {
    registerDecoratedMessage(messageElement);
  }
}

function getUserDecorations(chatroomId: string, usernameLower: string): Promise<UserDecorations> {
  const cacheKey = `${chatroomId}:${usernameLower}`;
  const cached = userDecorationsCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const decorationsPromise = Promise.all([
    zergo0Api.getUsernamePaint(chatroomId, usernameLower),
    zergo0Api.getUserBadges(usernameLower),
    zergo0Api.getUserPronouns(usernameLower)
  ]).then(([usernamePaint, badges, pronouns]) => ({
    usernamePaint,
    badges,
    pronouns
  }));

  userDecorationsCache.set(cacheKey, decorationsPromise);
  return decorationsPromise;
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
    ensureBadgesCssInjected();
    const badgeContainer = document.createElement('span');
    badgeContainer.style.marginRight = '0.25rem';
    badgeContainer.style.display = 'inline-flex';
    badgeContainer.style.alignItems = 'center';

    badgeContainer.appendChild(createBadgeElement(badge));
    parent.insertBefore(badgeContainer, beforeElement);
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

  ensureUserpaintCssInjected();

  if (design.class) {
    element.classList.add('userpaints-' + design.class);
  }

  if (design.textClass) {
    element.classList.add('userpaints-' + design.textClass);
  }

  if (!chatDecorationAnimationsEnabled) {
    element.style.animation = 'none';
    element.style.transition = 'none';
    element.style.filter = 'none';
  }

  if (
    chatDecorationAnimationsEnabled &&
    design.gif &&
    !element.querySelector('.userpaints-effect-overlay')
  ) {
    const img = document.createElement('img');
    img.src = 'https://zergo0botcdn.zergo0.dev/assets/' + design.gif + '.gif';
    img.alt = 'Username paint effect';
    img.classList.add('userpaints-effect-overlay');
    element.appendChild(img);
  }
}

function registerDecoratedMessage(messageElement: HTMLElement) {
  if (!chatDecorationAnimationsEnabled) {
    return;
  }

  if (managedDecoratedMessages.has(messageElement)) {
    return;
  }

  messageElement.classList.add(decorationManagedMessageClass, decorationPausedMessageClass);
  managedDecoratedMessages.add(messageElement);

  if (decorationVisibilityObserver) {
    decorationVisibilityObserver.observe(messageElement);
    return;
  }

  if (
    activeChatContainer &&
    activeChatContainer.contains(messageElement) &&
    messageElement.offsetParent !== null
  ) {
    messageElement.classList.remove(decorationPausedMessageClass);
  }
}

function unregisterDecoratedMessages(node: Node) {
  if (!(node instanceof Element)) {
    return;
  }

  if (managedDecoratedMessages.has(node as HTMLElement)) {
    const messageElement = node as HTMLElement;
    decorationVisibilityObserver?.unobserve(messageElement);
    managedDecoratedMessages.delete(messageElement);
  }

  const nestedDecoratedMessages = node.querySelectorAll(`.${decorationManagedMessageClass}`);
  for (const decoratedElement of nestedDecoratedMessages) {
    if (!(decoratedElement instanceof HTMLElement)) {
      continue;
    }

    decorationVisibilityObserver?.unobserve(decoratedElement);
    managedDecoratedMessages.delete(decoratedElement);
  }
}

function ensureBadgesCssInjected() {
  if (badgesCssInjected) {
    return;
  }

  const head = document.head;
  if (head.querySelector('style#ftv-badges-css')) {
    badgesCssInjected = true;
    return;
  }

  const style = document.createElement('style');
  style.id = 'ftv-badges-css';
  style.media = 'screen';
  style.innerHTML = badgesCss;
  head.appendChild(style);
  badgesCssInjected = true;
}

function ensureUserpaintCssInjected() {
  if (userpaintCssInjected) {
    return;
  }

  const head = document.head;
  if (head.querySelector('style#ftv-userpaint-css')) {
    userpaintCssInjected = true;
    return;
  }

  const style = document.createElement('style');
  style.id = 'ftv-userpaint-css';
  style.media = 'screen';
  style.innerHTML = userpaintCss;
  head.appendChild(style);
  userpaintCssInjected = true;
}

function createBadgeElement(badge: ZerGo0Badge) {
  const badgeRoot = document.createElement('span');
  badgeRoot.className = 'ftv-badge-container';

  const badgeItem = document.createElement('span');
  badgeItem.className = getBadgeClass(badge);
  badgeItem.style.cssText = getBadgeStyle(badge);
  badgeItem.title = badge.name;

  const badgeText = document.createElement('span');
  badgeText.className = 'badge-text';
  badgeText.textContent = ' Z ';
  badgeItem.appendChild(badgeText);

  if (chatDecorationAnimationsEnabled && badge.animationType === 'glow-sparkle') {
    for (let index = 1; index <= 16; index += 1) {
      const sparkle = document.createElement('span');
      sparkle.className = `sparkle sparkle-${index}`;
      badgeItem.appendChild(sparkle);
    }
  }

  badgeRoot.appendChild(badgeItem);
  return badgeRoot;
}

function badgeHasAnimation(badge: ZerGo0Badge) {
  return (
    badge.special === 'animated' &&
    typeof badge.animationType === 'string' &&
    badge.animationType.length > 0
  );
}

function getBadgeClass(badge: ZerGo0Badge): string {
  const classes = ['badge-item'];
  const animationType = badge.animationType;

  if (chatDecorationAnimationsEnabled && badgeHasAnimation(badge) && animationType) {
    if (animationType.includes('-')) {
      const animations = animationType.split('-');
      for (const animation of animations) {
        classes.push(`badge-${animation}`);
      }
    } else {
      classes.push(`badge-${animationType}`);
    }
  }

  return classes.join(' ');
}

function getBadgeStyle(badge: ZerGo0Badge): string {
  let style = `width: ${badgeSize}px; height: ${badgeSize}px;`;

  if (badge.gradientColors && badge.gradientColors.length > 0) {
    const gradientString = badge.gradientColors.join(', ');
    style += ` background: linear-gradient(135deg, ${gradientString});`;

    if (chatDecorationAnimationsEnabled && badge.animationType === 'glow') {
      style += ` --glow-color: ${badge.gradientColors[0]};`;
    }
  } else if (badge.backgroundColor) {
    style += ` background-color: ${badge.backgroundColor};`;
  } else if (badge.color) {
    style += ` background-color: #${badge.color};`;
  }

  if (badge.borderColor) {
    style += ` border: 1px solid ${badge.borderColor};`;
  }

  if (badge.textColor) {
    style += ` color: ${badge.textColor};`;
  }

  return style;
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
