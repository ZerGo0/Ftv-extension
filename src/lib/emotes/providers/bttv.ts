import { Emote } from "@/lib/types";
import { Provider } from "./provider";

export class Bttv extends Provider {
  constructor() {
    super("BTTV Global", "https://betterttv.com/favicon.png");
  }

  override async fetchEmotes(): Promise<Emote[]> {
    const resp = await fetch(
      "https://api.betterttv.net/3/cached/emotes/global",
      {
        headers: {
          Accept: "application/json",
        },
      },
    );
    if (resp.status !== 200) {
      console.warn("Failed to fetch", this.name);
      return [];
    }

    const json = await resp.json();
    if (json?.length === 0) {
      console.warn("Failed to parse", this.name);
      return [];
    }

    const emotes = json.map((e: any) => {
      return new Emote(
        e.code,
        "https://cdn.betterttv.net/emote/" + e.id + "/1x",
      );
    });

    return emotes;
  }
}

export class BttvUser extends Provider {
  userId: string;

  constructor(userId: string) {
    super("BTTV User", "https://betterttv.com/favicon.png");
    this.userId = userId;
  }

  override async fetchEmotes(): Promise<Emote[]> {
    if (this.userId === undefined || this.userId === "") {
      console.warn(this.name, `Emote fetch failed because user ID was invalid`);
      return [];
    }

    const resp = await fetch(
      "https://api.betterttv.net/3/cached/users/twitch/" + this.userId,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );
    if (resp.status !== 200) {
      console.warn("Failed to fetch", this.name);
      return [];
    }

    let json = await resp.json();
    if (json?.channelEmotes?.length === 0) {
      console.warn("Failed to parse", this.name);
      return [];
    }

    const emotes = json.channelEmotes.map((e: any) => {
      return new Emote(
        e.code,
        "https://cdn.betterttv.net/emote/" + e.id + "/1x",
      );
    });

    return emotes;
  }
}
