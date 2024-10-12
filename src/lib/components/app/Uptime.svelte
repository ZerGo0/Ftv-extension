<script lang="ts">
  import { getAuthToken, getFanslyAccount } from "../../providers/fansly";

  interface Props {
    // siteDocument: Document;
    // siteWindow: Window;
    siteLocalStorage: Storage;
  }

  let { siteLocalStorage }: Props = $props();

  let authToken: string;
  let startedAt: number = 0;
  let uptime: number | undefined = $state();

  onMount(async () => {
    if (!authToken) {
      authToken = getAuthToken(siteLocalStorage);

      if (!authToken || authToken.length === 0) {
        console.error("Could not get auth token");
        return;
      }
    }

    const username = window.location.pathname.split("/")[2];
    const accountResp = await getFanslyAccount(username, authToken);
    if (!accountResp) {
      console.error("Could not get account response");
      return;
    }

    if (accountResp?.streaming?.channel?.status !== 2) {
      console.error("Channel is not live");
      return;
    }

    if (accountResp?.streaming?.channel?.stream?.startedAt) {
      startedAt = new Date(
        accountResp.streaming.channel.stream.startedAt
      ).getTime();
      setInterval(() => {
        uptime = Date.now() - startedAt;
      }, 1000);
    }
  });

  function formatUptime(uptime: number): string {
    const hours = Math.floor(uptime / 3600000);
    const minutes = Math.floor((uptime % 3600000) / 60000);
    const seconds = Math.floor((uptime % 60000) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
</script>

{#if uptime}
  <main class="ml-2 font-bold">
    <span>
      {formatUptime(uptime)}
    </span>
  </main>
{/if}

<style>
</style>
