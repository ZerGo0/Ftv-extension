<script lang="ts">
  import { Emote } from '@/lib/types';

  interface Props {
    emote: Emote;
  }

  let { emote }: Props = $props();

  let chatInput: HTMLTextAreaElement | null = null;

  function onEmoteClick(emoteName: string) {
    if (!chatInput) {
      chatInput = document.querySelector(
        'app-chat-room > .chat-footer > * > .message-input-container > textarea'
      );

      if (!chatInput) {
        return;
      }
    }

    chatInput.value += emoteName + ' ';
    chatInput.dispatchEvent(new Event('input'));
  }
</script>

<div
  class="active:backdrop-brightness-60 z-0 flex h-10 w-1/5 items-center
                        justify-center duration-200 ease-in-out hover:rounded-md hover:backdrop-brightness-75"
  id="emote-button-container"
>
  <button
    class="emote-button flex h-10 w-full flex-grow items-center justify-center"
    title={emote.name}
    id="emote-button"
    onclick={() => onEmoteClick(emote.name)}
  >
    <img loading="lazy" class="emote max-h-[36px] p-1" src={emote.url} alt={emote.name} />
  </button>
</div>
