<script lang="ts">
  import { sharedState } from '@/lib/state/state.svelte';
  import Circle from '../icons/Circle.svelte';

  interface Props {
    size?: number;
    class?: string;
  }

  let { size = 12, class: className = '' }: Props = $props();
</script>

{#if sharedState.newExtensionVersion}
  <div class="absolute {className}">
    <Circle class="text-red-500" {size} />
  </div>
{/if}
