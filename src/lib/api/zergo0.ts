class Zergo0Api {
  async getTwitchId(fanslyId: string): Promise<string> {
    const resp = await fetch(
      `https://zergo0_bot.zergo0.dev/ftv/get/${fanslyId}`
    );
    if (!resp.ok) {
      console.error("Twitch Id request failed", resp);
      return "";
    }

    const twitchId = await resp.text();
    if (!twitchId) {
      console.error("Could not parse twitch id response");
      return "";
    }

    return twitchId;
  }
}

export const zergo0Api = new Zergo0Api();
