<script lang="ts">
  import '@/assets/app.pcss';

  interface Props {
    startedAt: number;
  }

  let { startedAt }: Props = $props();
  let uptime: number | undefined = $state(Date.now() - startedAt);
  let uptimeInterval: ReturnType<typeof setInterval>;

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
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
</script>

{#if uptime}
  <span class="text-xs" id="uptime-text">
    {formatUptime(uptime)}
  </span>
{/if}

<style>
  :global(body) {
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.1rem;
  }
</style>
