<script lang="ts">
  import "@/assets/app.pcss";

  interface Props {
    title: string;
  }

  let { title }: Props = $props();
</script>

<span
  class="text-xs text-overflow-ellipsis overflow-hidden whitespace-nowrap display-block"
  {title}
>
  {title}
</span>

<style>
  :global(body) {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.1rem;
  }
</style>
