<script lang="ts">
  import { Provider } from "@/lib/emotes/providers/provider";
  import { SearchIcon } from "lucide-svelte";

  interface Props {
    twitchUserIconUrl: string;
    provider: Provider;
    index: number;
    onInViewport: (
      e: CustomEvent<{ isIntersecting: boolean; index: number }>,
    ) => void;
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
            new CustomEvent("inViewport", {
              detail: {
                isIntersecting: entries[0].isIntersecting,
                index: index,
              },
            }),
          );
        },
        { threshold: 1 },
      );

      observer.observe(element);
    }, 500);
  }
</script>

<div
  class="sticky top-0 flex justify-center bg-[#1b1c21] z-10"
  id="emote-provider-sticky-container"
>
  <div
    class="flex flex-grow justify-center items-center h-10 pl-2 backdrop-brightness-125 rounded-b-md shadow-md"
    use:actionWhenInViewport
    id="emote-provider-header"
  >
    <div
      class="flex align-middle items-center w-6 h-6 select-none"
      id="emote-provider-icon"
    >
      {#if twitchUserIconUrl}
        <img loading="lazy" src={twitchUserIconUrl} alt={provider.name} />
        <img
          loading="lazy"
          class="absolute h-4 ml-4 top-1"
          src={provider.iconUrl}
          alt={provider.name}
        />
      {:else if provider.iconUrl.length > 0}
        <img
          loading="lazy"
          src={provider.iconUrl}
          alt={provider.name}
          class="h-6"
        />
      {:else}
        <SearchIcon size="20" />
      {/if}
    </div>
    <span class="ml-2 font-semibold" id="emote-provider-name"
      >{provider.name}</span
    >
  </div>
</div>
