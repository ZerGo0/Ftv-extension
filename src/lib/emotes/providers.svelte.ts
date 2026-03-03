import { Provider } from './providers/provider';

class EmoteProviderStore {
  allProviders: Provider[] = $state([]);
  providers: Provider[] = $state([]);

  reset() {
    this.allProviders = [];
    this.providers = [];
  }
}

export const emoteProviderStore = new EmoteProviderStore();
