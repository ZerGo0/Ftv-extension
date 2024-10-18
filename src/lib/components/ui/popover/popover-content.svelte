<script lang="ts">
  import { cn, flyAndScale } from "@/lib/utils.js";
  import { Popover as PopoverPrimitive } from "bits-ui";

  type $$Props = PopoverPrimitive.ContentProps;
  let className: $$Props["class"] = undefined;
  export let transition: $$Props["transition"] = flyAndScale;
  export let transitionConfig: $$Props["transitionConfig"] = undefined;
  export { className as class };
</script>

<PopoverPrimitive.Content
  {transition}
  {transitionConfig}
  class={cn(
    "flex flex-col bg-popover z-50 w-[320px] h-[360px] min-h-[150px] rounded-lg shadow-lg outline-none border-[1px] p-4",
    className,
  )}
  {...$$restProps}
>
  <slot />
</PopoverPrimitive.Content>
