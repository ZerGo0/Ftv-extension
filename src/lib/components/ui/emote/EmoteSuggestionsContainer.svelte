<script lang="ts">
  import '@/assets/app.pcss';
  import type { Emote } from '@/lib/types';
  import EmoteSuggestions from './EmoteSuggestions.svelte';

  interface Props {
    chatInput: HTMLTextAreaElement;
  }

  let { chatInput }: Props = $props();

  let suggestionsVisible = $state(false);
  let searchTerm = $state('');
  let selectedIndex = $state(0);
  let cursorWordStart = $state(-1);
  let cursorWordEnd = $state(-1);
  let containerElement: HTMLElement;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  let lastCursorPosition = -1;

  function getWordAtCursor(): {
    word: string;
    start: number;
    end: number;
  } | null {
    const cursorPos = chatInput.selectionStart;
    const text = chatInput.value;

    if (cursorPos === null) {
      return null;
    }

    // Find word boundaries
    let start = cursorPos;
    let end = cursorPos;

    // Move start backwards to find the beginning of the word
    while (start > 0 && text[start - 1] !== ' ' && text[start - 1] !== '\n') {
      start--;
    }

    // Move end forward to find the end of the word
    while (end < text.length && text[end] !== ' ' && text[end] !== '\n') {
      end++;
    }

    const word = text.substring(start, end);

    // Only return if cursor is within or at the end of a word
    if (word.length > 0 && cursorPos >= start && cursorPos <= end) {
      return { word, start, end };
    }

    return null;
  }

  function checkForSuggestions() {
    const wordInfo = getWordAtCursor();

    if (wordInfo && wordInfo.word.length > 0) {
      searchTerm = wordInfo.word;
      cursorWordStart = wordInfo.start;
      cursorWordEnd = wordInfo.end;
      selectedIndex = 0;
      suggestionsVisible = true;
    } else {
      hideSuggestions();
    }
  }

  function handleCursorChange() {
    const currentPosition = chatInput.selectionStart;

    // Hide suggestions immediately when cursor moves
    if (currentPosition !== lastCursorPosition) {
      lastCursorPosition = currentPosition;
      suggestionsVisible = false;

      // Clear existing timer
      if (debounceTimer !== undefined) {
        clearTimeout(debounceTimer);
      }

      // Set new timer to show suggestions after cursor stops moving
      debounceTimer = setTimeout(() => {
        checkForSuggestions();
        debounceTimer = undefined;
      }, 300); // 300ms delay after cursor stops
    }
  }

  function hideSuggestions() {
    // Clear any pending timer
    if (debounceTimer !== undefined) {
      clearTimeout(debounceTimer);
      debounceTimer = undefined;
    }

    suggestionsVisible = false;
    selectedIndex = 0;
    searchTerm = '';
    cursorWordStart = -1;
    cursorWordEnd = -1;
  }

  function insertEmote(emote: Emote) {
    if (cursorWordStart === -1 || cursorWordEnd === -1) {
      return;
    }

    const text = chatInput.value;
    const before = text.substring(0, cursorWordStart);
    const after = text.substring(cursorWordEnd);

    chatInput.value = before + emote.name + ' ' + after;

    // Set cursor position after the inserted emote
    const newCursorPos = cursorWordStart + emote.name.length + 1;
    chatInput.setSelectionRange(newCursorPos, newCursorPos);
    lastCursorPosition = newCursorPos;

    // Dispatch input event to trigger any listeners
    chatInput.dispatchEvent(new Event('input', { bubbles: true }));

    hideSuggestions();
    chatInput.focus();
  }

  function handleUpdateSelectedIndex(index: number) {
    selectedIndex = index;
  }

  // Handle all cursor changes (typing, clicking, arrow keys, etc.)
  chatInput.addEventListener('input', handleCursorChange);
  chatInput.addEventListener('click', handleCursorChange);
  chatInput.addEventListener('keyup', handleCursorChange);
  chatInput.addEventListener('selectionchange', handleCursorChange);

  // Handle keyboard navigation
  chatInput.addEventListener('keydown', (e) => {
    if (!suggestionsVisible) {
      return;
    }

    // Get the current filtered emotes count from the child component
    const suggestionsElement = containerElement?.querySelector('.ftv-emote-suggestions');
    if (!suggestionsElement) {
      return;
    }

    const emoteButtons = suggestionsElement.querySelectorAll('.ftv-emote-suggestion-item');
    const emoteCount = emoteButtons.length;

    if (emoteCount === 0) {
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        e.stopPropagation();
        if (selectedIndex > 0) {
          selectedIndex--;
        } else {
          selectedIndex = emoteCount - 1;
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        e.stopPropagation();
        if (selectedIndex < emoteCount - 1) {
          selectedIndex++;
        } else {
          selectedIndex = 0;
        }
        break;

      case 'Tab':
        e.preventDefault();
        e.stopPropagation();
        const selectedButton = emoteButtons[selectedIndex] as HTMLButtonElement;
        if (selectedButton) {
          selectedButton.click();
        }
        break;

      case 'Enter':
        if (!e.shiftKey) {
          // Hide suggestions when Enter is pressed (without Shift)
          // Fansly will send the message and clear the input
          hideSuggestions();
        }
        break;

      case 'Escape':
        e.preventDefault();
        hideSuggestions();
        break;
    }
  });

  // Hide suggestions when clicking outside
  function handleDocumentClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!chatInput.contains(target) && !target.closest('.ftv-emote-suggestions')) {
      hideSuggestions();
    }
  }

  $effect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      // Clean up any pending timer on unmount
      if (debounceTimer !== undefined) {
        clearTimeout(debounceTimer);
      }
    };
  });
</script>

<div bind:this={containerElement}>
  {#if suggestionsVisible}
    <EmoteSuggestions
      {searchTerm}
      {selectedIndex}
      onEmoteSelect={insertEmote}
      onUpdateSelectedIndex={handleUpdateSelectedIndex}
    />
  {/if}
</div>
