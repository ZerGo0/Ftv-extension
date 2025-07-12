<script lang="ts">
  import "@/assets/app.pcss";

  interface Props {
    title?: string;
  }

  let { title }: Props = $props();
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

<style>
</style>
