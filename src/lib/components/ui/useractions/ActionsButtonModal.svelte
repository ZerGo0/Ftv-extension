<script lang="ts">
  import { sharedState } from '@/lib/state/state.svelte';
  import { ActionType } from '@/lib/types';
  import { zergo0Api } from '@/lib/api/zergo0';
  import { Button } from '../button';
  import Modal from '../modal/Modal.svelte';
  import UpdateDot from '../updatedot/UpdateDot.svelte';
  import ChangelogModal from './actions/ChangelogModal.svelte';
  import ChatPollModal from './actions/ChatPollModal.svelte';
  import GiveawayModal from './actions/GiveawayModal.svelte';
  import UsernamePaintModal from './actions/UsernamePaintModal.svelte';

  interface Props {
    showModal: boolean;
  }

  let { showModal = $bindable() }: Props = $props();

  let actionModal: any;

  let action: ActionType = $state(ActionType.None);
  let hasUsernamePaintPermission: boolean = $state(false);

  // Check for username paint permissions when modal opens
  $effect(() => {
    if (showModal && sharedState.chatroomId) {
      zergo0Api.getUsernamePaintSettings(sharedState.chatroomId).then((hasPermission) => {
        hasUsernamePaintPermission = hasPermission;
      });
    }
  });

  function handleChangelog() {
    action = ActionType.Changelog;
  }

  function handleStartPoll() {
    action = ActionType.ChatPoll;
  }

  function handleStartGiveaway() {
    action = ActionType.Giveaway;
  }

  function handleSetUsernamePaint() {
    action = ActionType.UsernamePaint;
  }
</script>

<Modal bind:showModal bind:this={actionModal}>
  {#snippet header()}
    <h2>Actions</h2>
  {/snippet}

  {#snippet body()}
    <div class="flex flex-col space-y-2">
      <Button variant="secondary" onclick={handleChangelog} class="relative">
        <UpdateDot class="-right-1 -top-1" />

        Changelog
      </Button>

      {#if sharedState.isOwner || sharedState.isModerator}
        <Button variant="secondary" onclick={handleStartPoll}>Start Poll</Button>

        <Button variant="secondary" onclick={handleStartGiveaway}>Start Giveaway</Button>
      {/if}

      {#if hasUsernamePaintPermission}
        <Button variant="secondary" onclick={handleSetUsernamePaint}>Set Username Paint</Button>
      {/if}
    </div>
  {/snippet}
</Modal>

{#if action === ActionType.Changelog}
  <ChangelogModal bind:action />
{:else if action === ActionType.ChatPoll}
  <ChatPollModal bind:action />
{:else if action === ActionType.Giveaway}
  <GiveawayModal bind:action />
{:else if action === ActionType.UsernamePaint}
  <UsernamePaintModal bind:action />
{/if}
