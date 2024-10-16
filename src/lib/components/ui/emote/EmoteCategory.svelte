<script lang="ts">
  import { Provider } from "@/lib/emotes/providers/provider";
  import { createEventDispatcher } from "svelte";
  import EmoteButton from "./EmoteButton.svelte";
  import EmoteCategoryHeader from "./EmoteCategoryHeader.svelte";

  interface Props {
    provider: Provider;
    index: number;
    twitchUserIconUrl: string;
  }

  let { provider: provider, index, twitchUserIconUrl }: Props = $props();

  const dispatch = createEventDispatcher();

  function onInViewport(e: CustomEvent<any>) {
    dispatch("inViewport", e.detail);
  }
</script>

{#if provider.emotes.length > 0 || provider.name === "Search Result Emotes"}
  <div class="w-full" data-index={index} id="emote-category-{index}">
    <EmoteCategoryHeader
      {provider}
      {twitchUserIconUrl}
      {index}
      on:inViewport={onInViewport}
    />

    <div
      class="emotes w-full flex flex-1 flex-grow flex-wrap justify-start align-middle mb-2 mt-2"
      id="emote-category-emotes"
    >
      {#each provider.emotes as emote}
        <EmoteButton {emote} />
      {/each}
    </div>
  </div>
{/if}
