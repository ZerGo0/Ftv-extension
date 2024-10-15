<script lang="ts">
  import { Provider } from "@/lib/emotes/providers/provider";

  interface Props {
    category: Provider;
    index: number;
    twitchUserIconUrl: string;
  }

  let { category: provider, index, twitchUserIconUrl }: Props = $props();
</script>

{#if provider.emotes.length > 0}
  <div class="emote-category w-full" data-index={index}>
    <div
      class="emote-category-sticky-container sticky top-0 flex justify-center bg-[#1b1c21] z-10"
      id="emote-category-sticky-container"
    >
      <div
        class="flex flex-grow justify-center items-center h-10 pl-2 backdrop-brightness-125 rounded-b-md shadow-md"
      >
        <div class="flex align-middle items-center w-6 h-6 select-none">
          {#if twitchUserIconUrl}
            <img loading="lazy" src={twitchUserIconUrl} alt={provider.name} />
            <img
              loading="lazy"
              class="absolute h-4 ml-4 top-1"
              src={provider.iconUrl}
              alt={provider.name}
            />
          {:else if provider.iconUrl.length > 0}
            <img loading="lazy" src={provider.iconUrl} alt={provider.name} />
          {:else}
            <i class="text-2xl fas fa-search"></i>
          {/if}
        </div>
        <span class="ml-2 font-semibold">{provider.name}</span>
      </div>
    </div>

    <div
      class="emotes w-full flex flex-1 flex-grow flex-wrap justify-start align-middle mb-2 mt-2"
      id="emotes"
    >
      {#each provider.emotes as emote}
        <div
          class="button-container w-1/5 h-10 flex justify-center items-center z-0
                        hover:backdrop-brightness-75 active:backdrop-brightness-60 hover:rounded-md ease-in-out duration-200 {emote.hidden
            ? 'hidden'
            : ''}"
        >
          <button
            class="emote-button h-10 w-full flex flex-grow justify-center items-center"
            title={emote.name}
          >
            <img
              loading="lazy"
              class="emote p-1"
              src={emote.url}
              alt={emote.name}
            />
          </button>
        </div>
      {/each}
    </div>
  </div>
{/if}
