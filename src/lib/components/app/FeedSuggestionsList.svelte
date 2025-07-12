<script lang="ts">
  import "@/assets/app.pcss";
  import { onMount, onDestroy } from "svelte";

  interface Props {
    startedAt: number;
    title?: string;
  }

  let { startedAt, title }: Props = $props();

  let uptime: number | undefined = $state(Date.now() - startedAt);
  let uptimeInterval: any;

  onMount(async () => {
    uptimeInterval = setInterval(() => {
      uptime = Date.now() - startedAt;
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(uptimeInterval);
  });

  function formatUptime(uptime: number): string {
    const hours = Math.floor(uptime / 3600000);
    const minutes = Math.floor((uptime % 3600000) / 60000);
    const seconds = Math.floor((uptime % 60000) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
</script>

<div class="flex flex-col">
  {#if title}
    <span class="text-fansly-font-1 whitespace-pre font-bold overflow-hidden text-ellipsis whitespace-nowrap">
      {title}
    </span>
  {/if}
  {#if uptime}
    <span class="text-xs" id="uptime-text">
      {formatUptime(uptime)}
    </span>
  {/if}
</div>

<style>
</style>
