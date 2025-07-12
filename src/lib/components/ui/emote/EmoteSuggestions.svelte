<script lang="ts">
  import { emoteStore } from "@/lib/emotes/emotes.svelte";
  import type { Emote } from "@/lib/types";

  interface Props {
    searchTerm: string;
    onEmoteSelect: (emote: Emote) => void;
    selectedIndex: number;
    onUpdateSelectedIndex: (index: number) => void;
  }

  let {
    searchTerm,
    onEmoteSelect,
    selectedIndex,
    onUpdateSelectedIndex,
  }: Props = $props();

  let suggestedEmotes = $derived.by(() => {
    if (!searchTerm || searchTerm.length === 0) {
      return [];
    }
    return emoteStore.search(searchTerm).slice(0, 10); // Show max 10 emotes
  });

  function getMatchIndices(name: string, searchTerm: string): [number, number][] {
    const indices: [number, number][] = [];
    const lowerName = name.toLowerCase();
    const lowerSearchTerm = searchTerm.toLowerCase();
    let startIndex = 0;
    
    while (startIndex < lowerName.length) {
      const index = lowerName.indexOf(lowerSearchTerm, startIndex);
      if (index === -1) break;
      indices.push([index, index + searchTerm.length]);
      startIndex = index + 1;
    }
    
    return indices;
  }

  let containerRef: HTMLDivElement | null = $state(null);
  let emoteRefs: (HTMLButtonElement | null)[] = $state([]);

  $effect(() => {
    // Scroll the selected emote into view
    if (emoteRefs[selectedIndex] && containerRef) {
      const button = emoteRefs[selectedIndex];
      const container = containerRef;

      if (button) {
        const buttonRect = button.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        if (buttonRect.bottom > containerRect.bottom) {
          button.scrollIntoView({ block: "end", behavior: "smooth" });
        } else if (buttonRect.top < containerRect.top) {
          button.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      }
    }
  });
</script>

{#if suggestedEmotes.length > 0}
  <div
    bind:this={containerRef}
    class="ftv-emote-suggestions absolute bottom-full mb-1 left-0 right-0 bg-background/95 backdrop-blur-sm border border-border rounded-md shadow-lg h-[114px] overflow-y-auto overflow-x-hidden z-50"
  >
    <div class="flex flex-col">
      {#each suggestedEmotes as emote, index}
        <button
          bind:this={emoteRefs[index]}
          class="ftv-emote-suggestion-item flex items-center gap-2 p-2 hover:bg-accent/50 transition-colors duration-150 text-left {index ===
          selectedIndex
            ? 'bg-accent'
            : ''}"
          onclick={() => onEmoteSelect(emote)}
          onmouseenter={() => onUpdateSelectedIndex(index)}
          title={emote.name}
        >
          <img
            loading="lazy"
            class="h-6 w-6 object-contain flex-shrink-0"
            src={emote.url}
            alt={emote.name}
          />
          <span class="text-sm truncate flex-1">
            {#each emote.name.split('') as char, charIndex}
              {#if getMatchIndices(emote.name, searchTerm).some(([start, end]) => charIndex >= start && charIndex < end)}
                <span class="font-semibold text-primary">{char}</span>
              {:else}
                {char}
              {/if}
            {/each}
          </span>
        </button>
      {/each}
    </div>
  </div>
{/if}

<style>
  .ftv-emote-suggestions {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  }

  .ftv-emote-suggestions::-webkit-scrollbar {
    width: 6px;
  }

  .ftv-emote-suggestions::-webkit-scrollbar-track {
    background: transparent;
  }

  .ftv-emote-suggestions::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  .ftv-emote-suggestions::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
</style>
