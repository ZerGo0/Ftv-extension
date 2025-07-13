<script lang="ts">
  import { fanslyApi } from '@/lib/api/fansly.svelte';
  import { zergo0Api } from '@/lib/api/zergo0';
  import { botChatroomdId } from '@/lib/consts';
  import type { ChatPronoun } from '@/lib/types';
  import { Button } from '../button';
  import Modal from '../modal/Modal.svelte';

  interface Props {
    showModal: boolean;
  }

  let { showModal = $bindable() }: Props = $props();

  let errored = $state(false);
  let pronouns: ChatPronoun[] = $state([]);
  let subject = $state(1);
  let object = $state(1);

  onMount(async () => {
    pronouns = await zergo0Api.getChatPronouns();
    if (pronouns.length === 0) {
      console.warn('No pronouns found');
      return;
    }
  });

  async function handleSetPronouns() {
    if (subject === 0 || object === 0) {
      console.warn('No pronouns selected');
      return;
    }

    setPronouns(subject, object);
  }

  async function handleRemovePronouns() {
    setPronouns(0, 0);
  }

  async function setPronouns(subject: number, object: number) {
    const result = await fanslyApi.sendChatMessage(
      botChatroomdId,
      `!setpronouns ${subject} ${object}`
    );
    if (!result) {
      errored = true;
    }

    errored = false;
    if (result === true) {
      setTimeout(() => {
        showModal = false;
        window.location.reload();
      }, 100);
    }
  }
</script>

<Modal bind:showModal>
  {#snippet header()}
    <h2>Set your chat pronouns</h2>
  {/snippet}

  {#snippet body()}
    <div class="flex flex-col justify-between gap-2">
      <div class="flex w-full flex-col items-center">
        <label for="subject">Subject</label>
        <select
          id="subject"
          class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-[invalid]:border-destructive"
          bind:value={subject}
        >
          {#each pronouns as pronoun}
            <option value={pronoun.id}>{pronoun.subject}</option>
          {/each}
        </select>
      </div>

      <div class="flex w-full flex-col items-center">
        <label for="subject">Object</label>
        <select
          id="subject"
          class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-[invalid]:border-destructive"
          bind:value={object}
        >
          {#each pronouns as pronoun}
            <option value={pronoun.id}>{pronoun.object}</option>
          {/each}
        </select>
      </div>
    </div>
    <div class="mt-2 flex flex-col space-y-2">
      <Button variant="default" onclick={handleSetPronouns}>Set</Button>
      <Button variant="destructive" onclick={handleRemovePronouns}>Remove</Button>
      {#if errored}
        <p class="text-red-500">
          Could not set pronouns, please try again later or contact support
        </p>
      {/if}
    </div>
  {/snippet}
</Modal>
