class FanslyApi {
  // NOTE: This class needs to called the first time outside of the shadow root
  // because it needs to access the proper window object
  private window: Window = window;
  private localStorage: Storage = localStorage;
  private authToken: string = "";

  constructor() {
    this.authToken = this.getAuthToken();
  }

  async getFanslyAccount(username: string): Promise<any> {
    if (!username) {
      console.warn("No username provided");
      return "";
    }

    const isId = username.length === 18 && !isNaN(Number.parseInt(username));
    const resp = await fetch(
      `https://apiv3.fansly.com/api/v1/account?${isId ? "ids=" : "usernames="}${username}`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: this.authToken,
        },
        referrer: "https://fansly.com/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
      },
    );

    if (!resp.ok) {
      console.warn("Account request failed", resp);
      return "";
    }

    const json = await resp.json();
    if (!json || !json.success) {
      console.warn("Could not parse account response");
      return "";
    }

    return json?.response[0];
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

  async getChatroomId(): Promise<string | undefined> {
    let localchatroomId: string;
    if (this.window.location.pathname.includes("/live/")) {
      const username = this.window.location.pathname.split("/")[2];
      localchatroomId = await this.getFanslyIdByUsername(username);
    } else if (this.window.location.pathname.includes("/chatroom/")) {
      const urlSplit = this.window.location.pathname.split("/");
      if (urlSplit.length !== 3) {
        console.warn("Invalid chatroom URL");
        return;
      }

      localchatroomId = urlSplit[2];
    } else if (this.window.location.pathname.endsWith("/creator/streaming")) {
      const session = localStorage.getItem("session_active_session");
      if (!session) {
        console.warn("No session found");
        return;
      }

      const sessionJson = JSON.parse(session);
      localchatroomId = sessionJson.accountId;
    } else {
      console.warn("Not in a live or chatroom page, how did we get here?");
      return;
    }

    return localchatroomId;
  }

  async sendChatMessage(chatroomId: string, message: string): Promise<boolean> {
    if (!chatroomId || !message) {
      console.warn("No chatroom or message provided");
      return false;
    }

    const resp = await fetch(
      "https://apiv3.fansly.com/api/v1/chatroom/message",
      {
        method: "POST",
        headers: {
          Authorization: this.authToken,
          Referer: "https://fansly.com/",
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        body: JSON.stringify({
          chatRoomId: chatroomId,
          content: message,
        }),
        referrer: "https://fansly.com/",
        referrerPolicy: "strict-origin-when-cross-origin",
        mode: "cors",
        credentials: "include",
      },
    );

    if (!resp.ok) {
      console.warn("Something went wrong, could not send chat message");
      return false;
    }

    const data = await resp.json();
    if (!data?.success) {
      console.warn("Something went wrong, could not send chat message");
      return false;
    }

    return true;
  }
}

export const fanslyApi = new FanslyApi();
