import type {
  ChatPronoun,
  ZerGo0Badge,
  ZerGo0Emote,
  ZerGo0Response,
  ZerGo0UsernamePaint,
  ZerGo0UsernamePaintSettings
} from '../types';
import { Cache } from '../utils/cache';
import { deduplicatedFetch } from '../utils/requestDeduplicator';

class Zergo0Api {
  pronounsCache = new Cache<string>();
  badgesCache = new Cache<ZerGo0Badge[]>();
  usernamePaintCache = new Cache<ZerGo0UsernamePaint | null>();

  async getTwitchId(fanslyId: string): Promise<string> {
    const resp = await deduplicatedFetch(`https://zergo0_bot.zergo0.dev/ftv/get/${fanslyId}`);
    if (!resp.ok) {
      console.warn('Twitch Id request failed', resp);
      return '';
    }

    const twitchId = await resp.text();
    if (!twitchId) {
      console.warn('Could not parse twitch id response');
      return '';
    }

    return twitchId;
  }

  async getChatPronouns(): Promise<ChatPronoun[]> {
    try {
      const response = await deduplicatedFetch('https://zergo0_bot.zergo0.dev/ftv/pronouns');
      if (!response.ok) {
        console.warn('Could not fetch pronouns');
        return [];
      }

      const json = await response.json();
      if (!json || !json.success) {
        console.warn('Invalid pronouns response');
        return [];
      }

      return json.response as ChatPronoun[];
    } catch (error) {
      console.warn('Could not fetch pronouns', error);
      return [];
    }
  }

  async getUserPronouns(username: string): Promise<string> {
    if (this.pronounsCache.has(username)) {
      return this.pronounsCache.get(username) as Promise<string>;
    }

    const pronounsPromise = (async () => {
      const resp = await deduplicatedFetch(
        `https://zergo0_bot.zergo0.dev/ftv/pronouns/user/${username}`
      );
      if (!resp.ok) {
        console.warn('User pronouns request failed', resp);
        return '';
      }

      return await resp.text();
    })();

    this.pronounsCache.set(username, pronounsPromise);
    return pronounsPromise;
  }

  async getPublicEmotes(chatroomId: string): Promise<ZerGo0Emote[]> {
    try {
      const resp = await deduplicatedFetch(
        `https://zergo0_bot.zergo0.dev/api/public/v1/emotes/${chatroomId}`
      );
      if (!resp.ok) {
        console.warn('Public emotes request failed', resp);
        return [];
      }

      const json = (await resp.json()) as ZerGo0Response<ZerGo0Emote[]>;
      if (!json || !json.success) {
        console.warn('Could not parse public emotes response');
        return [];
      }

      return json.response;
    } catch (error) {
      console.warn('Public emotes request failed', error);
      return [];
    }
  }

  async getUserBadges(username: string): Promise<ZerGo0Badge[]> {
    if (this.badgesCache.has(username)) {
      return this.badgesCache.get(username) as Promise<ZerGo0Badge[]>;
    }

    const badgesPromise = (async () => {
      try {
        const resp = await deduplicatedFetch(
          `https://zergo0_bot.zergo0.dev/ftv/badges/user/${username}`
        );
        if (!resp.ok) {
          console.warn('User badges request failed', resp);
          return [];
        }

        const json = (await resp.json()) as ZerGo0Response<ZerGo0Badge[]>;
        if (!json || !json.success) {
          console.warn('Could not parse user badges response');
          return [];
        }

        return json.response;
      } catch (error) {
        console.warn('User badges request failed', error);
        return [];
      }
    })();

    this.badgesCache.set(username, badgesPromise);
    return badgesPromise;
  }

  async getUsernamePaint(
    chatroomId: string,
    username: string
  ): Promise<ZerGo0UsernamePaint | null> {
    if (this.usernamePaintCache.has(username)) {
      return this.usernamePaintCache.get(username) as Promise<ZerGo0UsernamePaint | null>;
    }

    const paintPromise = (async () => {
      try {
        const resp = await deduplicatedFetch(
          `https://zergo0_bot.zergo0.dev/ftv/username-paint/${chatroomId}/user/${username}`
        );
        if (!resp.ok) {
          console.warn('Username paint request failed', resp);
          return null;
        }

        const json = (await resp.json()) as ZerGo0Response<ZerGo0UsernamePaint>;
        if (!json || !json.success) {
          console.warn('Could not parse username paint response');
          return null;
        }

        return json.response;
      } catch (error) {
        console.warn('Username paint request failed', error);
        return null;
      }
    })();

    this.usernamePaintCache.set(username, paintPromise);
    return paintPromise;
  }

  async getUsernamePaintSettings(creatorId: string): Promise<boolean> {
    try {
      const resp = await deduplicatedFetch(
        `https://zergo0_bot.zergo0.dev/ftv/username-paint/usersettings?creatorId=${creatorId}`
      );
      if (!resp.ok) {
        console.warn('Username paint settings request failed', resp);
        return false;
      }

      const json = (await resp.json()) as ZerGo0Response<ZerGo0UsernamePaintSettings>;
      if (!json || !json.success) {
        console.warn('Could not parse username paint settings response');
        return false;
      }

      // Check if allow_chatters_set_paint is enabled
      return json.response.allow_chatters_set_paint === 'true';
    } catch (error) {
      console.warn('Username paint settings request failed', error);
      return false;
    }
  }
}

export const zergo0Api = new Zergo0Api();
