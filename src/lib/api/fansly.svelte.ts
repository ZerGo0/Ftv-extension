import {
  FanslyAccountResponse,
  FanslyChatroomResponse,
  FanslyFollowingStreamsOnlineResponse,
  FanslyMeResponse,
  FanslyResponse,
} from "../types";
import { deduplicatedFetch } from "../utils/requestDeduplicator";

class FanslyApi {
  // NOTE: This class needs to called the first time outside of the shadow root
  // because it needs to access the proper window object
  private window: Window = window;
  private localStorage: Storage = localStorage;
  private authToken: string = "";

  constructor() {
    this.authToken = this.getAuthToken();
  }

  getAuthToken(): string {
    if (this.authToken && this.authToken !== "") {
      return this.authToken;
    }

    const session = this.localStorage.getItem("session_active_session");
    if (!session) {
      console.warn("Could not find session in local storage");
      return "";
    }

    const sessionJson = JSON.parse(session);
    if (!sessionJson || !sessionJson.token) {
      console.warn("Could not parse session JSON");
      return "";
    }

    const authToken = sessionJson.token;
    if (!authToken) {
      console.warn("Could not find auth token in session");
      return "";
    }

    return authToken;
  }

  private async fanslyRequest<T>(
    url: string,
    method: string = "GET",
    body: any = null,
  ): Promise<T | undefined> {
    if (!this.authToken) {
      console.warn("No auth token found");
      return;
    }

    let tryCount = 0;

    while (tryCount < 3) {
      try {
        const resp = await deduplicatedFetch(url, {
          headers: {
            accept: "application/json, text/plain, */*",
            authorization: this.authToken,
          },
          referrer: "https://fansly.com/",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: body ? body : null,
          method: method,
          mode: "cors",
          credentials: "include",
        });

        if (!resp.ok) {
          console.warn("Fansly request failed", resp);
          return;
        }

        return resp.json() as T;
      } catch (error) {
        console.warn("Fansly request failed", error);
        tryCount++;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  async getFanslyAccount(
    username: string,
  ): Promise<FanslyAccountResponse | undefined> {
    if (!username) {
      console.warn("No username provided");
      return;
    }

    const isId = username.length === 18 && !isNaN(Number.parseInt(username));
    const resp = await this.fanslyRequest<
      FanslyResponse<FanslyAccountResponse[]>
    >(
      `https://apiv3.fansly.com/api/v1/account?${
        isId ? "ids=" : "usernames="
      }${username}&ngsw-bypass=true`,
    );

    if (!resp || !resp.success) {
      console.warn("Request failed", resp);
      return;
    }

    return resp?.response[0];
  }

  async getFanslyIdByUsername(username: string): Promise<string> {
    const accountResp = await this.getFanslyAccount(username);
    if (!accountResp) {
      console.warn("Could not get account response");
      return "";
    }

    const chatRoomId = accountResp.streaming?.channel?.chatRoomId;
    if (chatRoomId === undefined) {
      console.warn("Could not find chatroomID", username);
      return "";
    }

    return chatRoomId;
  }

  async getCurrentChatroomId(
    mePromise: Promise<FanslyMeResponse | undefined> = Promise.resolve(
      undefined,
    ),
  ): Promise<string | undefined> {
    let localChatroomId: string;

    if (this.window.location.pathname.includes("/live/")) {
      // https://fansly.com/live/zergo0_bot
      // https://fansly.com/live/407996034761891840
      const username = this.window.location.pathname.split("/")[2];
      localChatroomId = await this.getFanslyIdByUsername(username);
    } else if (this.window.location.pathname.includes("/chatroom/")) {
      // https://fansly.com/chatroom/408830844350771200
      const urlSplit = this.window.location.pathname.split("/");
      if (urlSplit.length !== 3) {
        console.warn("Invalid chatroom URL");
        return;
      }

      localChatroomId = urlSplit[2];
    } else if (this.window.location.pathname.endsWith("/creator/streaming")) {
      // https://fansly.com/creator/streaming
      const me = await mePromise;
      if (!me) {
        console.warn("Could not get me");
        return;
      }

      localChatroomId = me.account?.streaming?.channel?.chatRoomId;
    } else {
      // any other page should end up here and should not be a chatroom
      return;
    }

    return localChatroomId;
  }

  async sendChatMessage(chatroomId: string, message: string): Promise<boolean> {
    if (!chatroomId || !message) {
      console.warn("No chatroom or message provided");
      return false;
    }

    const resp = await this.fanslyRequest<FanslyResponse<any>>(
      "https://apiv3.fansly.com/api/v1/chatroom/message",
      "POST",
      JSON.stringify({
        chatRoomId: chatroomId,
        content: message,
      }),
    );

    if (!resp || !resp.success) {
      console.warn("Request failed", resp);
      return false;
    }

    return true;
  }

  async getChatroomByChatroomId(
    chatroomId: string,
  ): Promise<FanslyChatroomResponse | undefined> {
    if (!chatroomId) {
      console.warn("No chatroom provided");
      return;
    }

    const resp = await this.fanslyRequest<
      FanslyResponse<FanslyChatroomResponse[]>
    >(
      `https://apiv3.fansly.com/api/v1/chatrooms?ids=${chatroomId}&ngsw-bypass=true`,
    );

    if (!resp || !resp.success) {
      console.warn("Request failed", resp);
      return;
    }

    if (!resp?.response || resp?.response.length === 0) {
      console.warn("No chatroom found");
      return;
    }

    return resp?.response[0];
  }

  async getOnlineFollowingStreams(): Promise<
    FanslyFollowingStreamsOnlineResponse | undefined
  > {
    const resp = await this.fanslyRequest<
      FanslyResponse<FanslyFollowingStreamsOnlineResponse>
    >(
      "https://apiv3.fansly.com/api/v1/streaming/followingstreams/online?ngsw-bypass=true",
    );

    if (!resp || !resp.success) {
      console.warn("Request failed", resp);
      return;
    }

    return resp?.response;
  }

  async getMe(): Promise<FanslyMeResponse | undefined> {
    const resp = await this.fanslyRequest<FanslyResponse<FanslyMeResponse>>(
      "https://apiv3.fansly.com/api/v1/account/me?ngsw-bypass=true",
    );

    if (!resp || !resp.success) {
      console.warn("Request failed", resp);
      return;
    }

    return resp?.response;
  }
}

export const fanslyApi = new FanslyApi();
