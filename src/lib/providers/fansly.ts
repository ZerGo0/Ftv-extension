export async function getFanslyAccount(
  username: string,
  authToken: string
): Promise<any> {
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
        authorization: authToken,
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

export function getAuthToken(localStorage: Storage): string {
  // Get the auth token from the local storage
  const session = localStorage.getItem("session_active_session");
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
