import { zergo0Api } from '@/lib/api/zergo0';
import { emoteStore } from '@/lib/emotes/emotes.svelte';
import { emoteProviderStore } from '@/lib/emotes/providers.svelte';
import { applyEmoteProviderTweaks } from '@/lib/emotes/tweaks.svelte';
import { Bttv, BttvUser } from '@/lib/emotes/providers/bttv';
import { Ffz, FfzUser } from '@/lib/emotes/providers/ffz';
import { Provider as EmoteProvider } from '@/lib/emotes/providers/provider';
import { SevenTv, SevenTvUser } from '@/lib/emotes/providers/seventv';
import { Twitch, TwitchUser } from '@/lib/emotes/providers/twitch';
import { ZerGo0BotUser } from '@/lib/emotes/providers/zergo0';
import { accountCard } from '@/lib/entryPoints/accountCard';
import { chatEmotes } from '@/lib/entryPoints/chatEmotes';
import {
  chatUsernameAutoComplete,
  usernamesCache
} from '@/lib/entryPoints/chatUsernameAutoComplete';
import { emoteMenuButton } from '@/lib/entryPoints/emoteMenuButton';
import { emoteSuggestions } from '@/lib/entryPoints/emoteSuggestions';
import { viewCount } from '@/lib/entryPoints/viewCount';
import { fanslyStyleFixes } from '@/lib/fanslyStyleFixes';
import { sharedState } from '@/lib/state/state.svelte';
import { findElementFromMutation } from '@/lib/utils/findElementFromMutation';
import { observeSerializedMutations } from '@/lib/utils/observeSerializedMutations';

const attachedClass = 'ftv-attached';
const mutationUrlPathWhitelist = [/\/live\/.*/, /\/chatroom\/.*/, /\/creator\/streaming/];
let firstInitPromise: Promise<void> | null = null;
let initializedChatRoomElement: HTMLElement | null = null;

export default defineContentScript({
  matches: ['https://fansly.com/*'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    observeSerializedMutations({
      pathWhitelist: mutationUrlPathWhitelist,
      target: document.body,
      config: { childList: true, subtree: true },
      processMutation: async (mutation) => {
        fanslyStyleFixes(ctx);
        await handleFirstInit(mutation);

        chatEmotes(ctx, mutation);
        accountCard(ctx, mutation);
        emoteMenuButton(ctx, mutation);
        emoteSuggestions(ctx, mutation);
        chatUsernameAutoComplete(ctx, mutation);
        viewCount(ctx, mutation);
      },
      onError: (error) => {
        console.error('chat.content mutation queue failed', error);
      }
    });
  }
});

async function handleFirstInit(mutation: MutationRecord) {
  if (firstInitPromise) {
    await firstInitPromise;
    return;
  }

  const chatRoomElement = findElementFromMutation(mutation, 'app-chat-room');
  if (!chatRoomElement) {
    return;
  }

  if (
    chatRoomElement.classList.contains(attachedClass) &&
    initializedChatRoomElement === chatRoomElement
  ) {
    return;
  }

  chatRoomElement.classList.add(attachedClass);

  firstInitPromise = (async () => {
    emoteStore.reset();
    emoteProviderStore.reset();
    usernamesCache.clear();
    zergo0Api.pronounsCache.clear();
    zergo0Api.badgesCache.clear();
    zergo0Api.usernamePaintCache.clear();

    try {
      await sharedState.initialize();

      const providers = await getEmoteProviders(sharedState.twitchUserId, sharedState.chatroomId);
      emoteProviderStore.allProviders = providers;
      applyEmoteProviderTweaks();

      initializedChatRoomElement = chatRoomElement;
    } catch (error) {
      console.error('chat.content emote initialization failed', error);
      emoteProviderStore.allProviders = [];
      applyEmoteProviderTweaks();
    } finally {
      emoteStore.setReady(true);
    }
  })();

  try {
    await firstInitPromise;
  } finally {
    firstInitPromise = null;
  }
}

async function getEmoteProviders(
  twitchUserId: string | undefined,
  chatroomId: string | undefined
): Promise<EmoteProvider[]> {
  let emoteProviders: Promise<EmoteProvider>[] = [];

  if (chatroomId) {
    emoteProviders = [...emoteProviders, loadProvider(new ZerGo0BotUser(chatroomId))];
  }

  if (twitchUserId) {
    emoteProviders = [
      ...emoteProviders,
      loadProvider(new TwitchUser(twitchUserId)),
      loadProvider(new SevenTvUser(twitchUserId)),
      loadProvider(new FfzUser(twitchUserId)),
      loadProvider(new BttvUser(twitchUserId))
    ];
  }

  emoteProviders = [
    ...emoteProviders,
    loadProvider(new SevenTv()),
    loadProvider(new Ffz()),
    loadProvider(new Bttv()),
    loadProvider(new Twitch())
  ];

  return Promise.all(emoteProviders);
}

async function loadProvider(provider: EmoteProvider): Promise<EmoteProvider> {
  const emotes = await provider.fetchEmotes();
  provider.emotes = emotes;
  return provider;
}
