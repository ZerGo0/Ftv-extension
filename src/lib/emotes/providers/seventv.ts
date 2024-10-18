import { Emote } from "@/lib/types";
import { Provider } from "./provider";

export class SevenTv extends Provider {
  constructor() {
    super("7TV Global", "https://7tv.app/favicon.ico");
  }

  override async fetchEmotes(): Promise<Emote[]> {
    try {
      const resp = await fetch("https://7tv.io/v3/emote-sets/global");
      if (resp.status !== 200) {
        console.error("Failed to fetch", this.name);
        return [];
      }

      const json = await resp.json();
      if (json?.length === 0 || json.emotes === undefined) {
        console.error("Failed to parse BTTV emotes");
        return [];
      }

      const emotes = json.emotes.map((e: any) => {
        return new Emote(e.name, `https:${e.data.host.url}/1x.webp`);
      });

      return emotes;
    } catch (e) {
      console.error("Failed to fetch", this.name);
      return [];
    }
  }
}

export class SevenTvUser extends Provider {
  userId: string;

  constructor(userId: string) {
    super("7TV User", "https://7tv.app/favicon.ico");
    this.userId = userId;
  }

  override async fetchEmotes(): Promise<Emote[]> {
    if (this.userId === undefined || this.userId === "") {
      console.error(
        this.name,
        `Emote fetch failed because user ID was invalid`,
      );
      return [];
    }

    try {
      const resp = await fetch(`https://7tv.io/v3/users/twitch/${this.userId}`);
      if (resp.status !== 200) {
        console.error("Failed to fetch", this.name);
        return [];
      }

      const json = await resp.json();
      if (
        json?.length === 0 ||
        json.emote_set === undefined ||
        json.emote_set.emotes === undefined
      ) {
        console.error("Failed to parse", this.name);
        return [];
      }

      const emotes = json.emote_set.emotes.map((e: any) => {
        return new Emote(e.name, `https:${e.data.host.url}/1x.webp`);
      });

      return emotes;
    } catch (e) {
      console.error("Failed to fetch", this.name);
      return [];
    }
  }
}
