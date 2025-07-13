<script lang="ts">
  import { cn, flyAndScale } from '@/lib/utils.js';
  import { Popover as PopoverPrimitive } from 'bits-ui';

  type $$Props = PopoverPrimitive.ContentProps;
  let className: $$Props['class'] = undefined;
  export let transition: $$Props['transition'] = flyAndScale;
  export let transitionConfig: $$Props['transitionConfig'] = undefined;
  export { className as class };
</script>

<PopoverPrimitive.Content
  {transition}
  {transitionConfig}
  class={cn(
    'z-50 flex h-[360px] min-h-[150px] w-[320px] flex-col rounded-lg border-[1px] bg-popover p-4 shadow-lg outline-none',
    className
  )}
  {...$$restProps}
>
  <slot />
</PopoverPrimitive.Content>
