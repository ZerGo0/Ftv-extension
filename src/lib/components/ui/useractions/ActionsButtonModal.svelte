<script lang="ts">
  import { sharedState } from "@/lib/state/state.svelte";
  import { ActionType } from "@/lib/types";
  import { Button } from "../button";
  import Modal from "../modal/Modal.svelte";
  import ChatPollModal from "./actions/ChatPollModal.svelte";

  interface Props {
    showModal: boolean;
  }

  let { showModal = $bindable() }: Props = $props();

  let actionModal: any;

  let action: ActionType = $state(ActionType.None);

  function handleStartPoll() {
    action = ActionType.ChatPoll;
  }
</script>

<Modal bind:showModal bind:this={actionModal}>
  {#snippet header()}
    <h2>Actions</h2>
  {/snippet}

  {#snippet body()}
    <div class="flex flex-col space-y-2">
      {#if sharedState.isOwner || sharedState.isModerator}
        <Button variant="secondary" onclick={handleStartPoll}>
          Start Poll
        </Button>
      {:else}
        <p>No actions available</p>
      {/if}
    </div>
  {/snippet}
</Modal>

{#if action === ActionType.ChatPoll}
  <ChatPollModal bind:action />
{/if}
