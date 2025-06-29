import type {
  ChatPronoun,
  ZerGo0Badge,
  ZerGo0Emote,
  ZerGo0Response,
  ZerGo0UsernamePaint,
} from "../types";

class Zergo0Api {
  async getTwitchId(fanslyId: string): Promise<string> {
    const resp = await fetch(
      `https://zergo0_bot.zergo0.dev/ftv/get/${fanslyId}`
    );
    if (!resp.ok) {
      console.warn("Twitch Id request failed", resp);
      return "";
    }

    const twitchId = await resp.text();
    if (!twitchId) {
      console.warn("Could not parse twitch id response");
      return "";
    }

    return twitchId;
  }

  async getChatPronouns(): Promise<ChatPronoun[]> {
    try {
      const response = await fetch(
        "https://zergo0_bot.zergo0.dev/ftv/pronouns"
      );
      if (!response.ok) {
        console.warn("Could not fetch pronouns");
        return [];
      }

      const json = await response.json();
      if (!json || !json.success) {
        console.warn("Invalid pronouns response");
        return [];
      }

      return json.response as ChatPronoun[];
    } catch (error) {
      console.warn("Could not fetch pronouns", error);
      return [];
    }
  }

  async getPublicEmotes(chatroomId: string): Promise<ZerGo0Emote[]> {
    try {
      const resp = await fetch(
        `https://zergo0_bot.zergo0.dev/api/public/v1/emotes/${chatroomId}`
      );
      if (!resp.ok) {
        console.warn("Public emotes request failed", resp);
        return [];
      }

      const json = (await resp.json()) as ZerGo0Response<ZerGo0Emote[]>;
      if (!json || !json.success) {
        console.warn("Could not parse public emotes response");
        return [];
      }

      return json.response;
    } catch (error) {
      console.warn("Public emotes request failed", error);
      return [];
    }
  }

  async getUserBadges(username: string): Promise<ZerGo0Badge[]> {
    try {
      const resp = await fetch(
        `https://zergo0_bot.zergo0.dev/ftv/badges/user/${username}`
      );
      if (!resp.ok) {
        console.warn("User badges request failed", resp);
        return [];
      }

      const json = (await resp.json()) as ZerGo0Response<ZerGo0Badge[]>;
      if (!json || !json.success) {
        console.warn("Could not parse user badges response");
        return [];
      }

      return json.response;
    } catch (error) {
      console.warn("User badges request failed", error);
      return [];
    }
  }

  async getUsernamePaint(
    username: string
  ): Promise<ZerGo0UsernamePaint | null> {
    try {
      const resp = await fetch(
        `https://zergo0_bot.zergo0.dev/ftv/username-paint/${username}`
      );
      if (!resp.ok) {
        console.warn("Username paint request failed", resp);
        return null;
      }

      const json = (await resp.json()) as ZerGo0Response<ZerGo0UsernamePaint>;
      if (!json || !json.success) {
        console.warn("Could not parse username paint response");
        return null;
      }

      return json.response;
    } catch (error) {
      console.warn("Username paint request failed", error);
      return null;
    }
  }
}

export const zergo0Api = new Zergo0Api();
