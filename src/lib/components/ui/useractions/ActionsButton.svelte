<script lang="ts">
  import { BotMessageSquare } from "lucide-svelte";
  import UpdateDot from "../updatedot/UpdateDot.svelte";
  import ActionsButtonModal from "./ActionsButtonModal.svelte";

  let showModal = $state(false);
</script>

<div class="w-full" id="actions-button-container">
  <button
    class="actions-button w-full flex justify-center items-center backdrop-brightness-125 hover:backdrop-brightness-90 active:backdrop-brightness-90 ease-in-out duration-200 text-fansly-darkblue-1 hover:text-fansly-blue-1"
    title="Actions"
    aria-label="User Actions"
    id="actions-button"
    onclick={() => (showModal = true)}
  >
    <UpdateDot class="top-0 right-0 m-1" />

    <BotMessageSquare class="m-2" />
  </button>
</div>

<ActionsButtonModal bind:showModal />
