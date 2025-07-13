import { fanslyApi } from '../api/fansly.svelte';
import { zergo0Api } from '../api/zergo0';
import { checkIfExtensionVersionIsNewer } from '../helpers';
import {
  FanslyChatroomResponse,
  FanslyFollowingStreamsOnlineAggregationDataAccount,
  FanslyMeResponse
} from '../types';

class SharedState {
  chatroomId: string | undefined = $state(undefined);
  twitchUserId: string | undefined = $state(undefined);
  isOwner: boolean = $state(false);
  isModerator: boolean = $state(false);
  onlineCreators: {
    setAt: Date;
    accounts: FanslyFollowingStreamsOnlineAggregationDataAccount[];
  } = $state({ setAt: new Date(), accounts: [] });
  mePromise: Promise<FanslyMeResponse | undefined> = $state(this.initializeMe());
  chatroom: FanslyChatroomResponse | undefined = $state(undefined);
  newExtensionVersion: boolean = $state(checkIfExtensionVersionIsNewer());
  selectedProvider: number = $state(1);

  private initializationPromise: Promise<void> | null = null;
  private lastInitializationTime: number = 0;
  private readonly MIN_INITIALIZATION_INTERVAL = 5000;

  constructor() {}

  async initialize() {
    const now = Date.now();
    if (
      this.initializationPromise &&
      now - this.lastInitializationTime < this.MIN_INITIALIZATION_INTERVAL
    ) {
      return this.initializationPromise;
    }

    this.lastInitializationTime = now;
    this.initializationPromise = this.initializeChatroom();

    try {
      await this.initializationPromise;
    } finally {
      // Clear the promise after completion or error
      this.initializationPromise = null;
    }
  }

  private async initializeMe() {
    return fanslyApi.getMe();
  }

  private async initializeChatroom() {
    this.chatroomId = await fanslyApi.getCurrentChatroomId(this.mePromise);
    if (!this.chatroomId) {
      return;
    }

    const twitchUserIdPromise = zergo0Api.getTwitchId(this.chatroomId).then((twitchId) => {
      this.twitchUserId = twitchId;
    });
    const chatroomPromise = fanslyApi
      .getChatroomByChatroomId(this.chatroomId)
      .then(async (chatroom) => {
        this.chatroom = chatroom;
        if (!this.chatroom) {
          return;
        }

        this.isModerator = (this.chatroom.accountFlags & 2) === 2;

        const me = await this.mePromise;
        this.isOwner = me?.account.id === this.chatroom.accountId;
      });

    await Promise.all([twitchUserIdPromise, chatroomPromise]);
  }

  async getOnlineAccounts() {
    if (
      this.onlineCreators.accounts.length > 0 &&
      this.onlineCreators.setAt > new Date(Date.now() - 1000 * 60 * 1)
    ) {
      return this.onlineCreators.accounts;
    }

    const onlineFollowingStreams = await fanslyApi.getOnlineFollowingStreams();
    if (!onlineFollowingStreams) {
      return;
    }

    this.onlineCreators = {
      setAt: new Date(),
      accounts: onlineFollowingStreams.aggregationData.accounts
    };

    return this.onlineCreators.accounts;
  }
}

export const sharedState = new SharedState();
