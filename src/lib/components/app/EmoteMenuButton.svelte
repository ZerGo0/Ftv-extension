<script lang="ts">
  import "@/assets/app.pcss";
  import { emoteStore } from "@/lib/emotes/emotes.svelte";
  import { emoteProviderStore } from "@/lib/emotes/providers.svelte";
  import { Provider } from "@/lib/emotes/providers/provider";
  import { Emote } from "@/lib/types";
  import { SmileIcon } from "lucide-svelte";
  import { Button } from "../ui/button";
  import EmoteCategory from "../ui/emote/EmoteCategory.svelte";
  import EmoteSelector from "../ui/emote/EmoteSelector.svelte";
  import { Input } from "../ui/input";
  import * as Popover from "../ui/popover";
  import SetPronounsButton from "../ui/pronouns/SetPronounsButton.svelte";

  let shadowRoot: ShadowRoot =
    document.querySelector("ftv-emotes-ui")!.shadowRoot!;
  let twitchUserIconUrl = $derived(
    emoteProviderStore.provdiers.length > 0
      ? emoteProviderStore.provdiers[0].iconUrl
      : ""
  );
  let visibleProviders: number[] = [];
  let selectedProvider = $state(0);
  let emotesContainer: HTMLDivElement;
  let searchTerm = $state("");
  let searchResult: Emote[] = $derived(
    searchTerm.length > 0 ? emoteStore.search(searchTerm) : []
  );

  function isUserProvider(providerName: string): boolean {
    if (providerName.includes("User")) {
      return true;
    }

    return false;
  }

  function onInViewport(e: CustomEvent<any>) {
    const idx = e.detail.index;
    const isIntersecting = e.detail.isIntersecting;

    if (isIntersecting) {
      if (!visibleProviders.includes(idx)) {
        visibleProviders.push(idx);
      }
    } else {
      visibleProviders = visibleProviders.filter((i) => i !== idx);
    }

    selectedProvider = Math.min(...visibleProviders);
  }

  // TODO: refactor this function...
  function onScrollToProvider(idx: number) {
    if (emotesContainer.children.length === 0) {
      console.error("Emote container has no childrens");
      return;
    }

    // The category is the data-index of the category,
    // but emotesContainer.children might not be in the same order
    // as the categories, so we need to find the correct child
    // We need to count which child it is
    let childIndex = 0;
    for (let i = 0; i < emotesContainer.children.length; i++) {
      let child = emotesContainer.children[i];
      if (child.getAttribute("data-index") === idx.toString()) {
        childIndex = i;
        break;
      }
    }

    const searchbarInput = shadowRoot.querySelector(
      "#emote-search"
    ) as HTMLInputElement;
    if (searchbarInput && searchbarInput.value.length > 0) {
      searchbarInput.value = "";
      searchbarInput.dispatchEvent(new Event("input"));

      setTimeout(() => {
        onScrollToProvider(idx);
      }, 100);
      return;
    }

    const topOffset = (emotesContainer.children[0] as HTMLElement).offsetTop;

    emotesContainer.scrollTo({
      top:
        (emotesContainer.children[childIndex] as HTMLElement).offsetTop -
        topOffset,
      behavior: "smooth",
    });
  }
</script>

<Popover.Root portal={null} closeOnOutsideClick={false}>
  <Popover.Trigger asChild let:builder>
    <div class="ml-1 flex items-center" id="emote-menu-button-container">
      <Button
        builders={[builder]}
        variant="icon"
        size="clear"
        id="emote-menu-button"
      >
        <SmileIcon size="20" />
      </Button>
    </div>
  </Popover.Trigger>
  <Popover.Content class="right-0 translate-y-[-107%]" strategy={"fixed"}>
    <header class="flex justify-between items-center mb-2" id="emote-header">
      <Input
        placeholder="Search emotes"
        class="w-full"
        id="emote-search"
        bind:value={searchTerm}
      />
    </header>

    <div
      class="flex overflow-hidden text-fansly-font-1 h-full"
      id="emotes-body"
    >
      <div
        class="w-full flex flex-col overflow-y-auto no-scroll border rounded-l-lg"
        id="emotes-container"
        bind:this={emotesContainer}
      >
        {#if searchTerm.length > 0}
          <EmoteCategory
            provider={new Provider("Search Result", "", searchResult)}
            index={-1}
            twitchUserIconUrl={""}
          />
        {:else}
          {#each emoteProviderStore.provdiers as provider, i}
            <EmoteCategory
              {provider}
              index={i}
              twitchUserIconUrl={isUserProvider(provider.name)
                ? twitchUserIconUrl
                : ""}
              on:inViewport={onInViewport}
            />
          {/each}
        {/if}
      </div>
      <div
        class="flex flex-col border border-l-0 rounded-r-lg"
        id="emote-selector"
      >
        <div
          class="w-12 h-full flex flex-col overflow-y-auto no-scroll"
          id="category-selector-container"
        >
          {#each emoteProviderStore.provdiers as provider, i}
            <EmoteSelector
              category={provider}
              index={i}
              {selectedProvider}
              twitchUserIconUrl={isUserProvider(provider.name)
                ? twitchUserIconUrl
                : ""}
              on:scrollToProvider={(e) => onScrollToProvider(e.detail.index)}
            />
          {/each}
        </div>
        <div
          class="flex flex-col justify-center items-center text-primary border-t"
          id="category-selector-actions"
        >
          <SetPronounsButton />
        </div>
      </div>
    </div>
  </Popover.Content>
</Popover.Root>

<style>
</style>
