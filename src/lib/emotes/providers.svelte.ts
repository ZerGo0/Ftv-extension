import { Provider } from './providers/provider';

class EmoteProviderStore {
  providers: Provider[] = $state([]);

  reset() {
    this.providers = [];
  }
}

export const emoteProviderStore = new EmoteProviderStore();
