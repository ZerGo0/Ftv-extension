<script lang="ts">
  import { Provider } from "@/lib/emotes/providers/provider";
  import { SearchIcon } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";

  interface Props {
    twitchUserIconUrl: string;
    provider: Provider;
    index: number;
  }

  let { twitchUserIconUrl, provider, index }: Props = $props();

  const dispatch = createEventDispatcher();

  function actionWhenInViewport(element: HTMLElement) {
    const observer = new IntersectionObserver(
      (entries) => {
        dispatch("inViewport", {
          isIntersecting: entries[0].isIntersecting,
          index: index,
        });
      },
      { threshold: 1 }
    );

    observer.observe(element);
  }
</script>

<div
  class="emote-provider-sticky-container sticky top-0 flex justify-center bg-[#1b1c21] z-10"
  id="emote-provider-sticky-container"
>
  <div
    class="flex flex-grow justify-center items-center h-10 pl-2 backdrop-brightness-125 rounded-b-md shadow-md"
    use:actionWhenInViewport
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
        <SearchIcon size="20" />
      {/if}
    </div>
    <span class="ml-2 font-semibold">{provider.name}</span>
  </div>
</div>
