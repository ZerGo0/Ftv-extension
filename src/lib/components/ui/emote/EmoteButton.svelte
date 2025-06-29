<script lang="ts">
  import { Emote } from "@/lib/types";

  interface Props {
    emote: Emote;
  }

  let { emote }: Props = $props();

  let chatInput: HTMLTextAreaElement | null = null;

  function onEmoteClick(emoteName: string) {
    if (!chatInput) {
      chatInput = document.querySelector(
        "app-chat-room > .chat-footer > * > .message-input-container > textarea",
      );

      if (!chatInput) {
        return;
      }
    }

    chatInput.value += emoteName + " ";
    chatInput.dispatchEvent(new Event("input"));
  }
</script>

<div
  class="w-1/5 h-10 flex justify-center items-center z-0
                        hover:backdrop-brightness-75 active:backdrop-brightness-60 hover:rounded-md ease-in-out duration-200"
  id="emote-button-container"
>
  <button
    class="emote-button h-10 w-full flex flex-grow justify-center items-center"
    title={emote.name}
    id="emote-button"
    onclick={() => onEmoteClick(emote.name)}
  >
    <img
      loading="lazy"
      class="emote p-1 max-h-[36px]"
      src={emote.url}
      alt={emote.name}
    />
  </button>
</div>
