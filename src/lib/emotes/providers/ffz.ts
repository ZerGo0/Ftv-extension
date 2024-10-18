import { Emote } from "@/lib/types";
import { Provider } from "./provider";

export class Ffz extends Provider {
  constructor() {
    super(
      "FFZ Global",
      "https://frankerfacez.com/static/images/favicon-32.png",
    );
  }

  override async fetchEmotes(): Promise<Emote[]> {
    const resp = await fetch("https://api.frankerfacez.com/v1/set/global");
    if (resp.status !== 200) {
      console.warn("Failed to fetch", this.name);
      return [];
    }

    const json = await resp.json();
    if (
      !json?.sets ||
      !json.default_sets ||
      json.default_sets.length === 0 ||
      json.sets.length === 0
    ) {
      console.warn("Failed to parse", this.name);
      return [];
    }

    const emotes = json.sets[json.default_sets[0]]?.emoticons.map(
      (e: any) => new Emote(e.name, e.urls["1"]),
    );

    return emotes;
  }
}

export class FfzUser extends Provider {
  userId: string;

  constructor(userId: string) {
    super("FFZ User", "https://frankerfacez.com/static/images/favicon-32.png");
    this.userId = userId;
  }

  override async fetchEmotes(): Promise<Emote[]> {
    if (this.userId === undefined || this.userId === "") {
      console.warn(this.name, `Emote fetch failed because user ID was invalid`);
      return [];
    }

    const resp = await fetch(
      `https://api.frankerfacez.com/v1/room/id/${this.userId}`,
    );
    if (resp.status !== 200) {
      console.warn("Failed to fetch", this.name);
      return [];
    }

    const json = await resp.json();
    if (!json || !json.sets || json.sets.length === 0) {
      console.warn("Failed to parse", this.name);
      return [];
    }

    const emotes = json.sets[json.room.set].emoticons.map(
      (e: any) => new Emote(e.name, e.urls["1"]),
    );

    return emotes;
  }
}
