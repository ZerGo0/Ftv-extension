<script lang="ts">
  import { Emote } from "@/lib/types";

  interface Props {
    emote: Emote;
  }

  let { emote }: Props = $props();
</script>

<div
  class="button-container w-1/5 h-10 flex justify-center items-center z-0
                        hover:backdrop-brightness-75 active:backdrop-brightness-60 hover:rounded-md ease-in-out duration-200"
>
  <button
    class="emote-button h-10 w-full flex flex-grow justify-center items-center"
    title={emote.name}
  >
    <img loading="lazy" class="emote p-1" src={emote.url} alt={emote.name} />
  </button>
</div>
