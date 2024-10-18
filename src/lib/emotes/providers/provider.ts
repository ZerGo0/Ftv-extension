import type { Emote } from "../../types";

export class Provider {
  name: string;
  iconUrl: string;
  emotes: Emote[];

  constructor(name: string, iconUrl: string, emotes: Emote[] = []) {
    this.name = name + " Emotes";
    this.iconUrl = iconUrl;
    this.emotes = emotes;
  }

  async fetchEmotes(): Promise<Emote[]> {
    console.warn(
      "fetchEmotes function not overwritten by provider:",
      this.name,
    );
    return [];
  }
}
