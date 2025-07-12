<script lang="ts">
  interface Props {
    title: string;
  }

  let { title }: Props = $props();
</script>

<span
  class="font-base-l-caps text-text-white-1 text-overflow-ellipsis overflow-hidden whitespace-nowrap display-block"
  title={title}
>
  {title}
</span>