import type { Emote } from '../../types';

export type EmoteProviderType =
  | 'other'
  | 'zergo0Bot'
  | 'twitchUser'
  | 'sevenTvUser'
  | 'ffzUser'
  | 'bttvUser'
  | 'twitchGlobal'
  | 'sevenTvGlobal'
  | 'ffzGlobal'
  | 'bttvGlobal';

export class Provider {
  name: string;
  iconUrl: string;
  emotes: Emote[];
  type: EmoteProviderType;

  constructor(
    name: string,
    iconUrl: string,
    emotes: Emote[] = [],
    type: EmoteProviderType = 'other'
  ) {
    this.name = name + ' Emotes';
    this.iconUrl = iconUrl;
    this.emotes = emotes;
    this.type = type;
  }

  async fetchEmotes(): Promise<Emote[]> {
    console.warn('fetchEmotes function not overwritten by provider:', this.name);
    return [];
  }
}
