import { fanslyApi } from "@/lib/api/fansly.svelte";
import { zergo0Api } from "@/lib/api/zergo0";
import { emoteStore } from "@/lib/emotes/emotes.svelte";
import { emoteProviderStore } from "@/lib/emotes/providers.svelte";
import { Bttv, BttvUser } from "@/lib/emotes/providers/bttv";
import { Ffz, FfzUser } from "@/lib/emotes/providers/ffz";
import { Provider as EmoteProvider } from "@/lib/emotes/providers/provider";
import { SevenTv, SevenTvUser } from "@/lib/emotes/providers/seventv";
import { Twitch, TwitchUser } from "@/lib/emotes/providers/twitch";
import { accountCard, pronounsCache } from "@/lib/entryPoints/accountCard";
import { chatEmotes } from "@/lib/entryPoints/chatEmotes";
import {
  chatUsernameAutoComplete,
  usernamesCache,
} from "@/lib/entryPoints/chatUsernameAutoComplete";
import { emoteMenuButton } from "@/lib/entryPoints/emoteMenuButton";
import { uptime } from "@/lib/entryPoints/uptime";
import { fanslyStyleFixes } from "@/lib/fanslyStyleFixes";

const attachedClass = "ftv-attached";
const mutationUrlPathWhitelist = [
  "/live/.*",
  "/chatroom/.*",
  "/creator/streaming",
];

export default defineContentScript({
  matches: ["https://fansly.com/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    // This needs to be a MutationObserver because of client-side routing
    // When a user navigates to a new page, the actual page is not reloaded
    new MutationObserver(async (mutations) => {
      const urlPath = window.location.pathname;
      const isWhitelisted = mutationUrlPathWhitelist.some((path) =>
        new RegExp(path).test(urlPath),
      );
      if (!isWhitelisted) {
        return;
      }

      mutations.forEach(async (mutation) => {
        fanslyStyleFixes();
        handleFirstInit(mutation);

        chatEmotes();
        accountCard();
        emoteMenuButton(ctx);
        uptime(ctx, mutation);
        chatUsernameAutoComplete(ctx, mutation);
      });
    }).observe(document.body, { childList: true, subtree: true });
  },
});

async function handleFirstInit(mutation: MutationRecord) {
  const elem = mutation.target as HTMLElement;
  if (
    !elem ||
    elem.tagName !== "APP-CHAT-ROOM" ||
    elem.classList.contains(attachedClass)
  ) {
    return;
  }

  elem.classList.add(attachedClass);

  emoteStore.reset();
  emoteProviderStore.reset();
  usernamesCache.clear();
  pronounsCache.clear();

  let twitchUserId: string = "";
  const chatroomId = await fanslyApi.getChatroomId();
  if (chatroomId) {
    twitchUserId = await zergo0Api.getTwitchId(chatroomId);
  }

  console.log(`Loaded (ChatroomId: ${chatroomId} | TwitchId: ${twitchUserId})`);

  const providers = await getEmoteProviders(twitchUserId);
  emoteProviderStore.provdiers = providers;
  emoteStore.emotes = providers.flatMap((c) => c.emotes);
}

async function getEmoteProviders(
  twitchUserId: string,
): Promise<EmoteProvider[]> {
  let emoteProviders: Promise<EmoteProvider>[] = [];

  if (twitchUserId) {
    emoteProviders = [
      loadProvider(new TwitchUser(twitchUserId)),
      loadProvider(new SevenTvUser(twitchUserId)),
      loadProvider(new FfzUser(twitchUserId)),
      loadProvider(new BttvUser(twitchUserId)),
    ];
  }

  emoteProviders = [
    ...emoteProviders,
    loadProvider(new SevenTv()),
    loadProvider(new Ffz()),
    loadProvider(new Bttv()),
    loadProvider(new Twitch()),
  ];

  return Promise.all(emoteProviders);
}

async function loadProvider(provider: EmoteProvider): Promise<EmoteProvider> {
  const emotes = await provider.fetchEmotes();
  provider.emotes = emotes;
  return provider;
}
