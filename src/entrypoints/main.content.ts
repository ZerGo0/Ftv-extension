import { fanslyApi } from "@/lib/api/fansly.svelte";
import { zergo0Api } from "@/lib/api/zergo0";
import { emoteStore } from "@/lib/emotes/emotes.svelte";
import { emoteProviderStore } from "@/lib/emotes/providers.svelte";
import { Bttv, BttvUser } from "@/lib/emotes/providers/bttv";
import { Ffz, FfzUser } from "@/lib/emotes/providers/ffz";
import { Provider as EmoteProvider } from "@/lib/emotes/providers/provider";
import { SevenTv, SevenTvUser } from "@/lib/emotes/providers/seventv";
import { Twitch, TwitchUser } from "@/lib/emotes/providers/twitch";
import {
  chatUsernameAutoComplete,
  usernames,
} from "@/lib/entryPoints/chatUsernameAutoComplete";
import { emoteButton } from "@/lib/entryPoints/emoteButton";
import { uptime } from "@/lib/entryPoints/uptime";

const attachedClass = "ftv-attached";

export default defineContentScript({
  matches: ["*://*.fansly.com/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    // This needs to be a MutationObserver because of client-side routing
    // When a user navigates to a new page, the actual page is not reloaded
    new MutationObserver(async (mutations) => {
      mutations.forEach(async (mutation) => {
        handleFirstInit(mutation);

        emoteButton(ctx, mutation);
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
  usernames.clear();

  let twitchUserId: string = "";
  const chatroomId = await fanslyApi.getChatroomId();
  if (chatroomId) {
    twitchUserId = await zergo0Api.getTwitchId(chatroomId);
    if (!twitchUserId) {
      console.error("Could not get twitch user id");
      return;
    }
  }

  console.log(`Loaded (ChatroomId: ${chatroomId} | TwitchId: ${twitchUserId})`);

  const providers = await getEmoteProviders(twitchUserId);
  emoteProviderStore.provdiers = providers;
  emoteStore.emotes = providers.flatMap((c) => c.emotes);
}

async function getEmoteProviders(
  twitchUserId: string
): Promise<EmoteProvider[]> {
  let emoteProviders: EmoteProvider[] = [];

  if (twitchUserId) {
    emoteProviders = [
      await loadProvider(new TwitchUser(twitchUserId)),
      await loadProvider(new SevenTvUser(twitchUserId)),
      await loadProvider(new FfzUser(twitchUserId)),
      await loadProvider(new BttvUser(twitchUserId)),
    ];
  }

  emoteProviders = [
    ...emoteProviders,
    await loadProvider(new SevenTv()),
    await loadProvider(new Ffz()),
    await loadProvider(new Bttv()),
    await loadProvider(new Twitch()),
  ];

  return emoteProviders;
}

async function loadProvider(provider: EmoteProvider): Promise<EmoteProvider> {
  const emotes = await provider.fetchEmotes();
  provider.emotes = emotes;
  return provider;
}
