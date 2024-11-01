import { fanslyApi } from "../api/fansly.svelte";
import { zergo0Api } from "../api/zergo0";
import { checkIfExtensionVersionIsNewer } from "../helpers";
import {
  FanslyChatroomResponse,
  FanslyFollowingStreamsOnlineAggregationDataAccount,
  FanslyMeResponse,
} from "../types";

class SharedState {
  chatroomId: string | undefined = $state(undefined);
  twitchUserId: string | undefined = $state(undefined);
  isOwner: boolean = $state(false);
  isModerator: boolean = $state(false);
  onlineCreators: {
    setAt: Date;
    accounts: FanslyFollowingStreamsOnlineAggregationDataAccount[];
  } = $state({ setAt: new Date(), accounts: [] });
  me: Promise<FanslyMeResponse | undefined> = $state(
    Promise.resolve(undefined),
  );
  chatroom: FanslyChatroomResponse | undefined = $state(undefined);
  newExtensionVersion: boolean = $state(false);

  constructor() {
    this.me = this.initializeMe();
    this.newExtensionVersion = checkIfExtensionVersionIsNewer();
  }

  async initializeMe() {
    // NOTE: This should technically not change which is why we use this in a constructor.
    // initialize() gets called whenever we mount components and we don't need
    // to do this every time.
    return fanslyApi.getMe();
  }

  async initialize() {
    await this.initializeChatroom();
  }

  async initializeChatroom() {
    this.chatroomId = await fanslyApi.getCurrentChatroomId();
    if (!this.chatroomId) {
      return;
    }

    const twitchUserIdPromise = zergo0Api
      .getTwitchId(this.chatroomId)
      .then((twitchId) => {
        this.twitchUserId = twitchId;
      });

    const chatroomPromise = fanslyApi
      .getChatroomByChatroomId(this.chatroomId)
      .then(async (chatroom) => {
        this.chatroom = chatroom;

        if (this.chatroom) {
          this.isOwner =
            (await this.me)?.account.id === this.chatroom.accountId;
          this.isModerator = (this.chatroom.accountFlags & 2) === 2;
        }
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
      accounts: onlineFollowingStreams.aggregationData.accounts,
    };

    return this.onlineCreators.accounts;
  }
}

export const sharedState = new SharedState();
