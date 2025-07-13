<script lang="ts">
  import { Provider } from '@/lib/emotes/providers/provider';
  import { sharedState } from '@/lib/state/state.svelte';

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
    onScrollToProvider
  }: Props = $props();

  onDestroy(() => {
    // Kind of hacky, but we need to set this here, because EmoteMenuButton is always mounted
    // and Popover.Content, doesn't have a onMount hook...
    sharedState.selectedProvider = 1;
  });
</script>

{#if provider.emotes.length > 0}
  <div class="flex w-full flex-grow items-center" id="emote-selector-{index}">
    <button
      class="provider-button flex h-full w-full flex-grow items-center justify-center {index ===
      selectedProvider
        ? 'backdrop-brightness-90'
        : 'active:backdrop-brightness-80 backdrop-brightness-125 duration-200 ease-in-out hover:backdrop-brightness-90'}"
      title={provider.name}
      disabled={index === selectedProvider}
      onclick={() => {
        onScrollToProvider(new CustomEvent('scrollToProvider', { detail: { index } }));
      }}
      id="emote-selector-button"
    >
      {#if index === selectedProvider}
        <div class="absolute left-0 h-full w-0.5 bg-primary"></div>
      {/if}
      {#if twitchUserIconUrl}
        <img loading="lazy" class="category m-2 h-5" src={twitchUserIconUrl} alt={provider.name} />
        <img
          loading="lazy"
          class="category z-1 absolute -mr-4 -mt-4 h-3"
          src={provider.iconUrl}
          alt={provider.name}
        />
      {:else}
        <img loading="lazy" class="category m-2 h-5" src={provider.iconUrl} alt={provider.name} />
      {/if}
    </button>
  </div>
{/if}
