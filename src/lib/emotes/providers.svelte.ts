import { Provider } from "./providers/provider";

class EmoteProviderStore {
  provdiers: Provider[] = $state([]);

  reset() {
    this.provdiers = [];
  }
}

export const emoteProviderStore = new EmoteProviderStore();
