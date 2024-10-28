import { fanslyApi } from "../api/fansly.svelte";
import { zergo0Api } from "../api/zergo0";

class SharedState {
  chatroomId: string | undefined = $state(undefined);
  twitchUserId: string | undefined = $state(undefined);
  isOwner: boolean = $state(false);
  isModerator: boolean = $state(false);

  async initialize() {
    this.chatroomId = await fanslyApi.getChatroomId();
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
}

export const sharedState = new SharedState();
