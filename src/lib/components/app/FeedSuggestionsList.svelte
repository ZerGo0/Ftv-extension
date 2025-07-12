<script lang="ts">
  import "@/assets/app.pcss";

  interface Props {
    title?: string;
    startedAt?: number;
  }

  let { title, startedAt }: Props = $props();

  let uptime = $state("");

  function updateUptime() {
    if (!startedAt) return;
    
    const now = Math.floor(Date.now() / 1000);
    const elapsed = now - startedAt;
    
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    
    uptime = `${hours}h ${minutes}m`;
  }

  $effect(() => {
    if (startedAt) {
      updateUptime();
      const interval = setInterval(updateUptime, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  });
</script>

{#if title}
  <div
    class="font-bold overflow-hidden text-ellipsis whitespace-nowrap"
    id="stream-title-container"
    title={title}
  >
    <span class="text-fansly-font-1 whitespace-pre" id="stream-title-text">
      {title}
    </span>
  </div>
{/if}

{#if startedAt}
  <div class="text-sm text-gray-500">
    {uptime}
  </div>
{/if}

<style>
</style>
