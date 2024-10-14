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
      console.error("No username provided");
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
      }
    );

    if (!resp.ok) {
      console.error("Account request failed", resp);
      return "";
    }

    const json = await resp.json();
    if (!json || !json.success) {
      console.error("Could not parse account response");
      return "";
    }

    return json?.response[0];
  }

  getAuthToken(): string {
    if (this.authToken && this.authToken !== "") {
      return this.authToken;
    }

    console.log("Getting auth token from local storage");

    const session = this.localStorage.getItem("session_active_session");
    if (!session) {
      console.error("Could not find session in local storage");
      return "";
    }

    const sessionJson = JSON.parse(session);
    if (!sessionJson || !sessionJson.token) {
      console.error("Could not parse session JSON");
      return "";
    }

    const authToken = sessionJson.token;
    if (!authToken) {
      console.error("Could not find auth token in session");
      return "";
    }

    return authToken;
  }

  async getFanslyIdByUsername(username: string): Promise<string> {
    const accountResp = await this.getFanslyAccount(username);
    if (!accountResp) {
      console.error("Could not get account response");
      return "";
    }

    const chatRoomId = accountResp.streaming?.channel?.chatRoomId;
    if (chatRoomId === undefined) {
      console.error("Could not find chatroomID", username);
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
        console.error("Invalid chatroom URL");
        return;
      }

      localchatroomId = urlSplit[2];
    } else if (this.window.location.pathname.endsWith("/creator/streaming")) {
      const session = localStorage.getItem("session_active_session");
      if (!session) {
        console.error("No session found");
        return;
      }

      const sessionJson = JSON.parse(session);
      localchatroomId = sessionJson.accountId;
    } else {
      console.error("Not in a live or chatroom page, how did we get here?");
      return;
    }

    return localchatroomId;
  }
}

export const fanslyApi = new FanslyApi();
