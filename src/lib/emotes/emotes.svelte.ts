import type { Emote } from "../types";

class EmoteStore {
  // NOTE: this has to be a $state,
  // because we want to re-render the UI when the content of this array changes.
  // This makes it way easier compared to using a store :)
  emotes: Emote[] = $state([]);

  reset() {
    this.emotes = [];
  }

  search(term: string) {
    return this.emotes.filter((emote) =>
      emote.nameLower.includes(term.toLocaleLowerCase()),
    );
  }
}

export const emoteStore = new EmoteStore();
