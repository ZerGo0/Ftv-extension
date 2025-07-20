import TwitchIcon from '@/assets/providers/icons/Twitch.ico';
import { Emote } from '@/lib/types';
import { deduplicatedFetch } from '@/lib/utils/requestDeduplicator';
import { Provider } from './provider';

export class Twitch extends Provider {
  constructor() {
    super('Twitch Global', TwitchIcon);
  }

  override async fetchEmotes(): Promise<Emote[]> {
    const resp = await deduplicatedFetch('https://zergo0_bot.zergo0.dev/ftv/twitch/emotes');
    if (resp.status !== 200) {
      console.warn(this.name, `Emote fetch failed with status ${resp.status}`);
      return [];
    }

    const data = await resp.json();
    if (data?.data?.length === 0) {
      console.warn(this.name, `Emote fetch succeeded but data was invalid`);
      return [];
    }

    const emotes = data.data.map(
      (e: { name: string; id: string; images: { url_1x: string } }) =>
        new Emote(e.name, e.images.url_1x)
    );

    return emotes;
  }
}

export class TwitchUser extends Provider {
  userId: string;

  constructor(userId: string) {
    super('Twitch Sub', TwitchIcon);
    this.userId = userId;
  }

  override async fetchEmotes(): Promise<Emote[]> {
    if (this.userId === undefined || this.userId === '') {
      console.warn(this.name, `Emote fetch failed because user ID was invalid`);
      return [];
    }

    const resp = await deduplicatedFetch('https://gql.twitch.tv/gql', {
      method: 'POST',
      headers: {
        Accept: '*/*',
        // NOTE: Public client ID
        'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
        'Content-Type': 'text/plain;charset=UTF-8'
      },
      body: `[{"operationName":"EmotePicker_EmotePicker_UserSubscriptionProducts","variables":{"channelOwnerID":"${this.userId}"},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"71b5f829a4576d53b714c01d3176f192cbd0b14973eb1c3d0ee23d5d1b78fd7e"}}}]`
    });
    if (resp.status !== 200) {
      console.warn(this.name, `User fetch failed with status ${resp.status}`);
      return [];
    }

    const data = await resp.json();
    if (data?.length > 0 && data[0]?.data?.user?.profileImageURL) {
      this.iconUrl = data[0]?.data?.user?.profileImageURL;
    }

    if (
      !data ||
      data.length === 0 ||
      !data[0]?.data?.user?.id ||
      (!data[0]?.data?.channel?.localEmoteSets && !data[0]?.data?.user?.subscriptionProducts)
    ) {
      console.warn(this.name, 'User fetch failed');
      return [];
    }

    const emotes: Emote[] = [];

    if (data[0]?.data?.channel?.localEmoteSets) {
      for (const set of data[0].data.channel.localEmoteSets) {
        for (const emote of set.emotes) {
          emotes.push(
            new Emote(
              emote.token,
              emote.id.startsWith('emotesv2')
                ? `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/light/2.0`
                : `https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/2.0`
            )
          );
        }
      }
    }

    if (data[0]?.data?.user?.subscriptionProducts) {
      for (const product of data[0].data.user.subscriptionProducts) {
        for (const emote of product.emotes) {
          emotes.push(
            new Emote(
              emote.token,
              emote.id.startsWith('emotesv2')
                ? `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/light/2.0`
                : `https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/2.0`
            )
          );
        }
      }
    }

    return emotes;
  }
}
