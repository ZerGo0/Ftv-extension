<script lang="ts">
  import '@/assets/app.pcss';

  interface Props {
    title: string;
  }

  let { title }: Props = $props();
</script>

<span
  class="text-overflow-ellipsis display-block overflow-hidden whitespace-nowrap text-xs"
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
