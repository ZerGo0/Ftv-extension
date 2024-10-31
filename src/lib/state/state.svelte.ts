import { fanslyApi } from "../api/fansly.svelte";
import { zergo0Api } from "../api/zergo0";

class SharedState {
  chatroomId: string | undefined = $state(undefined);
  twitchUserId: string | undefined = $state(undefined);
  isOwner: boolean = $state(false);
  isModerator: boolean = $state(false);
  onlineCreators: {
    setAt: Date;
    accounts: any[];
  } = $state({ setAt: new Date(), accounts: [] });

  async initialize() {
    await this.initializeChatroom();
  }

  async initializeChatroom() {
    this.chatroomId = await fanslyApi.getCurrentChatroomId();
    if (!this.chatroomId) {
      return;
    }

    this.twitchUserId = await zergo0Api.getTwitchId(this.chatroomId);

    const chatroom = await fanslyApi.getChatroomByChatroomId(this.chatroomId);
    if (!chatroom) {
      console.warn("No chatroom found");
      return;
    }

    this.isOwner = chatroom.accountPermissionFlags % 65536 === 65535; // Not 100% sure about this one
    this.isModerator = (chatroom.accountFlags & 2) === 2;
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
