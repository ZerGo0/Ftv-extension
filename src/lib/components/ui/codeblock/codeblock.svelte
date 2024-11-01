<script lang="ts">
  interface Props {
    code: string;
  }

  let { code }: Props = $props();
</script>

<div class="text-sm font-medium">
  <pre class="whitespace-pre-wrap">
    <code class="">{code}</code>
  </pre>
</div>

<style>
</style>
