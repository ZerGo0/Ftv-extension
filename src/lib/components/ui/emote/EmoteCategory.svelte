<script lang="ts">
  import { Provider } from "@/lib/emotes/providers/provider";
  import EmoteButton from "./EmoteButton.svelte";
  import EmoteCategoryHeader from "./EmoteCategoryHeader.svelte";

  interface Props {
    provider: Provider;
    index: number;
    twitchUserIconUrl: string;
    onInViewport: (e: CustomEvent) => void;
  }

  let {
    provider: provider,
    index,
    twitchUserIconUrl,
    onInViewport,
  }: Props = $props();
</script>

{#if provider.emotes.length > 0 || provider.name === "Search Result Emotes"}
  <div class="w-full" data-index={index} id="emote-category-{index}">
    <EmoteCategoryHeader
      {provider}
      {twitchUserIconUrl}
      {index}
      {onInViewport}
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
