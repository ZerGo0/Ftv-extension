import type { ChatPronoun } from "../types";

class Zergo0Api {
  async getTwitchId(fanslyId: string): Promise<string> {
    const resp = await fetch(
      `https://zergo0_bot.zergo0.dev/ftv/get/${fanslyId}`,
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
    const response = await fetch("https://zergo0_bot.zergo0.dev/ftv/pronouns");
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
  }
}

export const zergo0Api = new Zergo0Api();
