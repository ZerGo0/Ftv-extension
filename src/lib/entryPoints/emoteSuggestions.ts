import { mount, unmount } from "svelte";
import EmoteSuggestions from "@/lib/components/ui/emote/EmoteSuggestions.svelte";
import type { Emote } from "@/lib/types";

const attachedClass = "ftv-emote-suggestions-attached";

export function emoteSuggestions(ctx: any, mutation: MutationRecord) {
  const element = mutation.target as HTMLElement;
  if (!element || !element.tagName || element.tagName !== "APP-CHAT-ROOM") {
    return;
  }

  const chatInput = element.querySelector(
    "app-chat-room > .chat-footer > * > .message-input-container > textarea",
  ) as HTMLTextAreaElement;

  if (!chatInput || chatInput.classList.contains(attachedClass)) {
    return;
  }

  chatInput.classList.add(attachedClass);

  let suggestionsComponent: any = null;
  let selectedIndex = 0;
  let currentSearchTerm = "";
  let cursorWordStart = -1;
  let cursorWordEnd = -1;

  // Create a container for the suggestions
  const suggestionsContainer = document.createElement("div");
  suggestionsContainer.className = "ftv-emote-suggestions-container";
  suggestionsContainer.style.position = "relative";

  // Insert the container before the message input container
  const messageInputContainer = chatInput.closest(".message-input-container");
  if (!messageInputContainer || !messageInputContainer.parentElement) {
    return;
  }

  messageInputContainer.parentElement.insertBefore(
    suggestionsContainer,
    messageInputContainer,
  );

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
    while (start > 0 && text[start - 1] !== " ") {
      start--;
    }

    // Move end forward to find the end of the word
    while (end < text.length && text[end] !== " ") {
      end++;
    }

    const word = text.substring(start, end);

    // Only return if cursor is within or at the end of a word
    if (word.length > 0 && cursorPos >= start && cursorPos <= end) {
      return { word, start, end };
    }

    return null;
  }

  function showSuggestions(
    searchTerm: string,
    wordStart: number,
    wordEnd: number,
  ) {
    currentSearchTerm = searchTerm;
    cursorWordStart = wordStart;
    cursorWordEnd = wordEnd;
    selectedIndex = 0;

    if (suggestionsComponent) {
      unmount(suggestionsComponent);
    }

    suggestionsComponent = mount(EmoteSuggestions, {
      target: suggestionsContainer,
      props: {
        searchTerm,
        selectedIndex,
        onEmoteSelect: (emote: Emote) => {
          insertEmote(emote);
        },
        onUpdateSelectedIndex: (index: number) => {
          selectedIndex = index;
          updateSuggestionsProps();
        },
      },
    });
  }

  function updateSuggestionsProps() {
    if (suggestionsComponent) {
      // Update the props by remounting with new props
      unmount(suggestionsComponent);
      suggestionsComponent = mount(EmoteSuggestions, {
        target: suggestionsContainer,
        props: {
          searchTerm: currentSearchTerm,
          selectedIndex,
          onEmoteSelect: (emote: Emote) => {
            insertEmote(emote);
          },
          onUpdateSelectedIndex: (index: number) => {
            selectedIndex = index;
            updateSuggestionsProps();
          },
        },
      });
    }
  }

  function hideSuggestions() {
    if (suggestionsComponent) {
      unmount(suggestionsComponent);
      suggestionsComponent = null;
    }
    selectedIndex = 0;
    currentSearchTerm = "";
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

    chatInput.value = before + emote.name + " " + after;

    // Set cursor position after the inserted emote
    const newCursorPos = cursorWordStart + emote.name.length + 1;
    chatInput.setSelectionRange(newCursorPos, newCursorPos);

    // Dispatch input event to trigger any listeners
    chatInput.dispatchEvent(new Event("input", { bubbles: true }));

    hideSuggestions();
    chatInput.focus();
  }

  // Handle input changes
  chatInput.addEventListener("input", () => {
    const wordInfo = getWordAtCursor();

    if (wordInfo && wordInfo.word.length > 0) {
      showSuggestions(wordInfo.word, wordInfo.start, wordInfo.end);
    } else {
      hideSuggestions();
    }
  });

  // Handle cursor position changes
  chatInput.addEventListener("click", () => {
    const wordInfo = getWordAtCursor();

    if (wordInfo && wordInfo.word.length > 0) {
      showSuggestions(wordInfo.word, wordInfo.start, wordInfo.end);
    } else {
      hideSuggestions();
    }
  });

  chatInput.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const wordInfo = getWordAtCursor();

      if (wordInfo && wordInfo.word.length > 0) {
        showSuggestions(wordInfo.word, wordInfo.start, wordInfo.end);
      } else {
        hideSuggestions();
      }
    }
  });

  // Handle keyboard navigation
  chatInput.addEventListener("keydown", (e) => {
    if (!suggestionsComponent) {
      return;
    }

    // Get the current filtered emotes count
    const suggestionsElement = suggestionsContainer.querySelector(
      ".ftv-emote-suggestions",
    );
    if (!suggestionsElement) {
      return;
    }

    const emoteButtons = suggestionsElement.querySelectorAll(
      ".ftv-emote-suggestion-item",
    );
    const emoteCount = emoteButtons.length;

    if (emoteCount === 0) {
      return;
    }

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        if (selectedIndex > 0) {
          selectedIndex--;
        } else {
          selectedIndex = emoteCount - 1;
        }
        updateSuggestionsProps();
        break;

      case "ArrowDown":
        e.preventDefault();
        if (selectedIndex < emoteCount - 1) {
          selectedIndex++;
        } else {
          selectedIndex = 0;
        }
        updateSuggestionsProps();
        break;

      case "ArrowLeft":
        if (chatInput.selectionStart === cursorWordStart) {
          // Only handle arrow left for navigation if at the start of the word
          e.preventDefault();
          if (selectedIndex > 0) {
            selectedIndex--;
          } else {
            selectedIndex = emoteCount - 1;
          }
          updateSuggestionsProps();
        }
        break;

      case "ArrowRight":
        if (chatInput.selectionStart === cursorWordEnd) {
          // Only handle arrow right for navigation if at the end of the word
          e.preventDefault();
          if (selectedIndex < emoteCount - 1) {
            selectedIndex++;
          } else {
            selectedIndex = 0;
          }
          updateSuggestionsProps();
        }
        break;

      case "Tab":
      case "Enter":
        if (e.key === "Tab" || (e.key === "Enter" && !e.shiftKey)) {
          e.preventDefault();
          const selectedButton = emoteButtons[
            selectedIndex
          ] as HTMLButtonElement;
          if (selectedButton) {
            selectedButton.click();
          }
        }
        break;

      case "Escape":
        e.preventDefault();
        hideSuggestions();
        break;
    }
  });

  // Hide suggestions when clicking outside
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (!chatInput.contains(target) && !suggestionsContainer.contains(target)) {
      hideSuggestions();
    }
  });

  // Clean up when input is removed
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        for (const removedNode of mutation.removedNodes) {
          if (
            removedNode === chatInput ||
            (removedNode as HTMLElement).contains?.(chatInput)
          ) {
            hideSuggestions();
            if (suggestionsContainer.parentElement) {
              suggestionsContainer.remove();
            }
            observer.disconnect();
            return;
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
