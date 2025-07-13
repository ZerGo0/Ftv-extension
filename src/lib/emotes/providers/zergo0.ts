import { zergo0Api } from '@/lib/api/zergo0';
import { Emote } from '@/lib/types';
import { Provider } from './provider';

export class ZerGo0BotUser extends Provider {
  chatroomId: string;

  constructor(chatroomId: string) {
    super('ZerGo0_Bot', 'https://zergo0_bot.zergo0.dev/favicon.png');
    this.chatroomId = chatroomId;
  }

  override async fetchEmotes(): Promise<Emote[]> {
    try {
      const emotes = await zergo0Api.getPublicEmotes(this.chatroomId);

      if (emotes.length === 0) {
        console.warn(`ZerGo0_Bot: Failed to fetch emotes for chatroom ${this.chatroomId}`);
        return [];
      }

      return emotes.map((emote) => new Emote(emote.name, emote.url));
    } catch (error) {
      console.warn('ZerGo0_Bot: Error fetching emotes:', error);
      return [];
    }
  }
}
