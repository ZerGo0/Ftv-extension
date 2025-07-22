import BttvIcon from '@/assets/providers/icons/BTTV.png';
import { Emote } from '@/lib/types';
import { deduplicatedFetch } from '@/lib/utils/requestDeduplicator';
import { Provider } from './provider';

export class Bttv extends Provider {
  constructor() {
    super('BTTV Global', BttvIcon);
  }

  override async fetchEmotes(): Promise<Emote[]> {
    const resp = await deduplicatedFetch('https://api.betterttv.net/3/cached/emotes/global', {
      headers: {
        Accept: 'application/json'
      }
    });
    if (resp.status !== 200) {
      console.warn('Failed to fetch', this.name);
      return [];
    }

    const json = await resp.json();
    if (json?.length === 0) {
      console.warn('Failed to parse', this.name);
      return [];
    }

    const emotes = json.map((e: any) => {
      return new Emote(e.code, 'https://cdn.betterttv.net/emote/' + e.id + '/3x');
    });

    return emotes;
  }
}

export class BttvUser extends Provider {
  userId: string;

  constructor(userId: string) {
    super('BTTV User', BttvIcon);
    this.userId = userId;
  }

  override async fetchEmotes(): Promise<Emote[]> {
    if (this.userId === undefined || this.userId === '') {
      console.warn(this.name, `Emote fetch failed because user ID was invalid`);
      return [];
    }

    const resp = await deduplicatedFetch(
      'https://api.betterttv.net/3/cached/users/twitch/' + this.userId,
      {
        headers: {
          Accept: 'application/json'
        }
      }
    );
    if (resp.status !== 200) {
      console.warn('Failed to fetch', this.name);
      return [];
    }

    let json = await resp.json();
    if (json?.channelEmotes?.length === 0) {
      console.warn('Failed to parse', this.name);
      return [];
    }

    const emotes = json.channelEmotes.map((e: any) => {
      return new Emote(e.code, 'https://cdn.betterttv.net/emote/' + e.id + '/3x');
    });

    return emotes;
  }
}
