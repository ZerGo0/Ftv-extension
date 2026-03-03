<script lang="ts">
  import * as ResizablePrimitive from 'paneforge';
  import { cn } from '@/lib/utils.js';

  type $$Props = ResizablePrimitive.PaneGroupProps;
  type PaneGroupInstance = ReturnType<typeof ResizablePrimitive.PaneGroup>;

  let className: $$Props['class'] = undefined;
  export let direction: $$Props['direction'];
  export let paneGroup: PaneGroupInstance | undefined = undefined;
  export let el: HTMLElement | null = null;
  export { className as class };
</script>

<ResizablePrimitive.PaneGroup
  bind:this={paneGroup}
  bind:ref={el}
  {direction}
  class={cn('flex h-full w-full data-[direction=vertical]:flex-col', className)}
  {...$$restProps}
>
  <slot />
</ResizablePrimitive.PaneGroup>
