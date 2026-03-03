import type { Emote } from '../types';

class EmoteStore {
  emotes: Emote[] = $state([]);
  ready: boolean = $state(false);

  reset() {
    this.emotes = [];
    this.ready = false;
  }

  setEmotes(emotes: Emote[]) {
    this.emotes = emotes;
  }

  setReady(ready: boolean) {
    this.ready = ready;
  }

  search(term: string) {
    return this.emotes.filter((emote) => emote.nameLower.includes(term.toLocaleLowerCase()));
  }
}

export const emoteStore = new EmoteStore();
