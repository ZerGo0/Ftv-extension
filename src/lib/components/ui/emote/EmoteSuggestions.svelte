<script lang="ts">
  import { emoteStore } from '@/lib/emotes/emotes.svelte';
  import type { Emote } from '@/lib/types';

  interface Props {
    searchTerm: string;
    onEmoteSelect: (emote: Emote) => void;
    selectedIndex: number;
    onUpdateSelectedIndex: (index: number) => void;
  }

  let { searchTerm, onEmoteSelect, selectedIndex, onUpdateSelectedIndex }: Props = $props();

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
  let scrollContainerRef: HTMLDivElement | null = $state(null);
  let emoteRefs: (HTMLButtonElement | null)[] = $state([]);

  $effect(() => {
    // Scroll the selected emote into view
    if (emoteRefs[selectedIndex] && scrollContainerRef) {
      const button = emoteRefs[selectedIndex];

      if (button) {
        const buttonRect = button.getBoundingClientRect();
        const containerRect = scrollContainerRef.getBoundingClientRect();

        // Check if button is outside visible area
        if (buttonRect.bottom > containerRect.bottom) {
          // Scroll down
          const scrollAmount = buttonRect.bottom - containerRect.bottom;
          scrollContainerRef.scrollTop += scrollAmount;
        } else if (buttonRect.top < containerRect.top) {
          // Scroll up
          const scrollAmount = containerRect.top - buttonRect.top;
          scrollContainerRef.scrollTop -= scrollAmount;
        }
      }
    }
  });
</script>

{#if suggestedEmotes.length > 0}
  <div
    bind:this={containerRef}
    class="ftv-emote-suggestions absolute bottom-full left-0 right-0 z-50 mb-6 overflow-hidden rounded-md border border-border bg-background/95 shadow-lg backdrop-blur-sm"
  >
    <div
      bind:this={scrollContainerRef}
      class="ftv-emote-list flex h-[114px] flex-col overflow-y-auto overflow-x-hidden"
    >
      {#each suggestedEmotes as emote, index}
        <button
          bind:this={emoteRefs[index]}
          class="ftv-emote-suggestion-item flex items-center gap-4 p-2 text-left transition-colors duration-150 hover:bg-accent/50 {index ===
          selectedIndex
            ? 'bg-accent'
            : ''}"
          onclick={() => onEmoteSelect(emote)}
          onmouseenter={() => onUpdateSelectedIndex(index)}
          title={emote.name}
        >
          <img
            loading="lazy"
            class="h-6 w-6 flex-shrink-0 object-contain"
            src={emote.url}
            alt={emote.name}
          />
          <span class="flex-1 truncate text-sm">
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
    <div
      class="flex items-center justify-between gap-2 border-t border-border px-2 py-1 text-xs text-muted-foreground"
    >
      <span>↑↓ Navigate</span>
      <span>Tab Select</span>
      <span>Esc Close</span>
    </div>
  </div>
{/if}

<style>
  .ftv-emote-suggestions {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
    width: fit-content;
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
