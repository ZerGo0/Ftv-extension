import { fanslyApi } from "../api/fansly.svelte";
import { zergo0Api } from "../api/zergo0";
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
  me: FanslyMeResponse | undefined = $state(undefined);
  chatroom: FanslyChatroomResponse | undefined = $state(undefined);

  async initialize() {
    await this.initializeMe();
    await this.initializeChatroom();
  }

  async initializeMe() {
    this.me = await fanslyApi.getMe();
  }

  async initializeChatroom() {
    this.chatroomId = await fanslyApi.getCurrentChatroomId();
    if (!this.chatroomId) {
      return;
    }

    this.twitchUserId = await zergo0Api.getTwitchId(this.chatroomId);

    this.chatroom = await fanslyApi.getChatroomByChatroomId(this.chatroomId);
    if (this.chatroom) {
      this.isOwner = this.me?.account.id === this.chatroom.accountId;
      this.isModerator = (this.chatroom.accountFlags & 2) === 2;
    }
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
