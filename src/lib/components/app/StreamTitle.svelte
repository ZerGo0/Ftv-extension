<script lang="ts">
  import { zergo0Api } from "@/lib/api/zergo0";

  interface Props {
    creatorId: string | undefined;
    chatroomId: string | undefined;
  }

  let { creatorId, chatroomId }: Props = $props();

  let streamTitle: string | undefined = $state();

  onMount(async () => {
    if (!chatroomId && !creatorId) {
      return;
    }

    const streamTitleResp = await zergo0Api.getStreamTitle(
      chatroomId,
      creatorId,
    );
    if (!streamTitleResp || streamTitleResp === "") {
      return;
    }

    streamTitle = streamTitleResp;
  });
</script>

{#if streamTitle}
  <div
    class="font-bold overflow-hidden text-ellipsis whitespace-nowrap"
    id="stream-title-container"
    title={streamTitle}
  >
    <span class="text-fansly-font-1 whitespace-pre" id="stream-title-text">
      {streamTitle}
    </span>
  </div>
{/if}

<style>
</style>
