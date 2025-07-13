<script lang="ts">
  import { BotMessageSquare } from 'lucide-svelte';
  import UpdateDot from '../updatedot/UpdateDot.svelte';
  import ActionsButtonModal from './ActionsButtonModal.svelte';

  let showModal = $state(false);
</script>

<div class="w-full" id="actions-button-container">
  <button
    class="actions-button flex w-full items-center justify-center text-fansly-darkblue-1 backdrop-brightness-125 duration-200 ease-in-out hover:text-fansly-blue-1 hover:backdrop-brightness-90 active:backdrop-brightness-90"
    title="Actions"
    aria-label="User Actions"
    id="actions-button"
    onclick={() => (showModal = true)}
  >
    <UpdateDot class="right-0 top-0 m-1" />

    <BotMessageSquare class="m-2" />
  </button>
</div>

<ActionsButtonModal bind:showModal />
