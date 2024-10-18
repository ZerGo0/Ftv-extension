<script lang="ts">
  import { Provider } from "@/lib/emotes/providers/provider";

  interface Props {
    category: Provider;
    index: number;
    twitchUserIconUrl: string;
    selectedProvider: number;
    onScrollToProvider: (e: CustomEvent<{ index: number }>) => void;
  }

  let {
    category: provider,
    index,
    twitchUserIconUrl,
    selectedProvider: selectedProvider,
    onScrollToProvider,
  }: Props = $props();
</script>

{#if provider.emotes.length > 0}
  <div class="w-full flex flex-grow items-center" id="emote-selector-{index}">
    <button
      class="provider-button w-full h-full flex flex-grow justify-center items-center {index ===
      selectedProvider
        ? 'backdrop-brightness-90'
        : 'backdrop-brightness-125 hover:backdrop-brightness-90 active:backdrop-brightness-80 ease-in-out duration-200'}"
      title={provider.name}
      disabled={index === selectedProvider}
      onclick={() => {
        onScrollToProvider(
          new CustomEvent("scrollToProvider", { detail: { index } })
        );
      }}
      id="emote-selector-button"
    >
      {#if index === selectedProvider}
        <div class="w-0.5 h-full bg-primary absolute left-0"></div>
      {/if}
      {#if twitchUserIconUrl}
        <img
          loading="lazy"
          class="category h-5 m-2"
          src={twitchUserIconUrl}
          alt={provider.name}
        />
        <img
          loading="lazy"
          class="category h-3 absolute z-1 -mr-4 -mt-4"
          src={provider.iconUrl}
          alt={provider.name}
        />
      {:else}
        <img
          loading="lazy"
          class="category h-5 m-2"
          src={provider.iconUrl}
          alt={provider.name}
        />
      {/if}
    </button>
  </div>
{/if}
