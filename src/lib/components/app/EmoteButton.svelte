<script lang="ts">
  import "@/assets/app.pcss";
  import { SmileIcon } from "lucide-svelte";
  import { Button } from "../ui/button";
  import { Input } from "../ui/input";
  import * as Popover from "../ui/popover";

  interface Props {
    siteDocument: Document;
    siteWindow: Window;
    siteLocalStorage: Storage;
  }

  let { siteDocument, siteWindow, siteLocalStorage }: Props = $props();

  // let popoverisOpen = $state(false);

  function handleBottomPositions() {
    if (
      window.location.pathname === "https://fansly.com/creator/streaming" ||
      window.location.pathname ===
        "https://fansly.com/chatroom/408830844350771200"
    ) {
      return "bottom-14";
    } else {
      return "bottom-12";
    }
  }
</script>

<Popover.Root portal={null} closeOnOutsideClick={false}>
  <Popover.Trigger asChild let:builder>
    <main class="ml-1 flex items-center">
      <Button builders={[builder]} variant="icon" size="clear">
        <SmileIcon size="20" />
      </Button>
    </main>
  </Popover.Trigger>
  <Popover.Content class="right-0 {handleBottomPositions()}">
    <header class="flex justify-between items-center rounded-t-lg mb-2">
      <Input placeholder="Search emotes" class="w-full" />
    </header>

    <div class="emotes-body h-full flex overflow-hidden text-primary">
      <div class="w-full flex flex-col overflow-y-auto no-scroll pl-2 pr-2">
        Temp 1
      </div>

      <div class="flex flex-col sha z-10 shadow-left-3">Temp 2</div>
    </div>
  </Popover.Content>
</Popover.Root>

<style>
</style>
