<script lang="ts">
  interface Props {
    createdAt: number;
  }

  let { createdAt }: Props = $props();
  let uptime = $state(formatUptime(createdAt));

  function formatUptime(createdAt: number): string {
    const startTime = new Date(createdAt * 1000);
    const now = new Date();
    const diff = now.getTime() - startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  const interval = setInterval(() => {
    uptime = formatUptime(createdAt);
  }, 60000);

  $effect(() => {
    return () => clearInterval(interval);
  });
</script>

<span class="text-text-white-3 font-body-b-md">
  {uptime}
</span>