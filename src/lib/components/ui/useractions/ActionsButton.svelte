<script lang="ts">
  import { BotMessageSquare } from "lucide-svelte";
  import ActionsButtonModal from "./ActionsButtonModal.svelte";

  let showModal = $state(false);
</script>

<div class="w-full" id="actions-button-container">
  <button
    class="actions-button w-full flex justify-center items-center backdrop-brightness-125 hover:backdrop-brightness-90 active:backdrop-brightness-90 ease-in-out duration-200"
    title="User Actions"
    aria-label="User Actions"
    id="actions-button"
    onclick={() => (showModal = true)}
  >
    <BotMessageSquare class="m-2" />
  </button>
</div>

<ActionsButtonModal bind:showModal />
