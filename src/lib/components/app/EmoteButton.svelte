<script lang="ts">
  import "@/assets/app.pcss";
  import { emoteProviderStore } from "@/lib/emotes/providers.svelte";
  import { SmileIcon } from "lucide-svelte";
  import { Button } from "../ui/button";
  import { Input } from "../ui/input";
  import * as Popover from "../ui/popover";
  import Category from "./Category.svelte";
  import Selector from "./Selector.svelte";

  interface Props {
    siteDocument: Document;
    siteWindow: Window;
    siteLocalStorage: Storage;
  }

  let { siteDocument, siteWindow, siteLocalStorage }: Props = $props();

  // let isOpen = $state(false);

  function handleBottomPositions() {
    if (
      window.location.pathname === "/creator/streaming" ||
      window.location.pathname.startsWith("/chatroom/")
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
    <header class="flex justify-between items-center mb-2">
      <Input placeholder="Search emotes" class="w-full" />
    </header>

    <div class="emotes-body flex overflow-hidden text-primary" id="emotes-body">
      <div
        class="w-full flex flex-col overflow-y-auto no-scroll border rounded-l-lg"
        id="emotes-container"
      >
        {#each emoteProviderStore.provdiers as provider, i}
          <Category category={provider} index={i} twitchUserIconUrl={""} />
        {/each}
        <!-- <Category
          category={new EmoteCategory('Search Result', '', emotes.filteredEmotes($searchterm))}
          hidden={$searchterm.length === 0}
          index={undefined}
          twitchUserIconUrl={''}
        /> -->
      </div>
      <div class="flex flex-col border border-l-0 rounded-r-lg">
        <div
          class="w-12 h-full flex flex-col overflow-y-auto no-scroll"
          id="category-selector"
        >
          {#each emoteProviderStore.provdiers as provider, i}
            <Selector
              category={provider}
              index={i}
              selectedCategory={0}
              twitchUserIconUrl={""}
            />
          {/each}
        </div>
        <div
          class="category-selector-actions flex flex-col justify-center items-center text-primary"
        >
          <!-- {#if isVerified && fanslyId !== null && fanslyId !== ''}
            <TwitchLink {fanslyId} />
          {/if}
          <SetPronounsButton /> -->
        </div>
      </div>
    </div>
  </Popover.Content>
</Popover.Root>

<style>
</style>
