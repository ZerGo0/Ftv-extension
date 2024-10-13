import type { Emote } from "../../types";
import * as h from "../helper";

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
    h.error("fetchEmotes function not overwritten by provider:", this.name);
    return [];
  }
}
