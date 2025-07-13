<script lang="ts">
  import { Provider } from '@/lib/emotes/providers/provider';
  import { SearchIcon } from 'lucide-svelte';

  interface Props {
    twitchUserIconUrl: string;
    provider: Provider;
    index: number;
    onInViewport: (e: CustomEvent<{ isIntersecting: boolean; index: number }>) => void;
  }

  let { twitchUserIconUrl, provider, index, onInViewport }: Props = $props();

  let observer: IntersectionObserver;

  onDestroy(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  function actionWhenInViewport(element: HTMLElement) {
    if (observer) {
      observer.disconnect();
    }

    setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          onInViewport(
            new CustomEvent('inViewport', {
              detail: {
                isIntersecting: entries[0].isIntersecting,
                index: index
              }
            })
          );
        },
        { threshold: 1 }
      );

      observer.observe(element);
    }, 500);
  }
</script>

<div
  class="sticky top-0 z-10 flex justify-center bg-[#1b1c21]"
  id="emote-provider-sticky-container"
>
  <div
    class="flex h-10 flex-grow items-center justify-center rounded-b-md pl-2 shadow-md backdrop-brightness-125"
    use:actionWhenInViewport
    id="emote-provider-header"
  >
    <div class="flex h-6 w-6 select-none items-center align-middle" id="emote-provider-icon">
      {#if twitchUserIconUrl}
        <img loading="lazy" src={twitchUserIconUrl} alt={provider.name} />
        <img
          loading="lazy"
          class="absolute top-1 ml-4 h-4"
          src={provider.iconUrl}
          alt={provider.name}
        />
      {:else if provider.iconUrl.length > 0}
        <img loading="lazy" src={provider.iconUrl} alt={provider.name} class="h-6" />
      {:else}
        <SearchIcon size="20" />
      {/if}
    </div>
    <span class="ml-2 font-semibold" id="emote-provider-name">{provider.name}</span>
  </div>
</div>
