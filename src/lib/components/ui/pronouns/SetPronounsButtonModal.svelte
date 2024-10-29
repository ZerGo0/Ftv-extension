<script lang="ts">
  import { fanslyApi } from "@/lib/api/fansly.svelte";
  import { zergo0Api } from "@/lib/api/zergo0";
  import { botChatroomdId } from "@/lib/consts";
  import type { ChatPronoun } from "@/lib/types";
  import { Button } from "../button";
  import Modal from "../modal/Modal.svelte";

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
      console.warn("No pronouns found");
      return;
    }
  });

  async function handleSetPronouns() {
    if (subject === 0 || object === 0) {
      console.warn("No pronouns selected");
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
      `!setpronouns ${subject} ${object}`,
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
    <div class="flex flex-col gap-2 justify-between">
      <div class="flex flex-col w-full items-center">
        <label for="subject">Subject</label>
        <select
          id="subject"
          class="border-input bg-background ring-offset-background focus-visible:ring-ring aria-[invalid]:border-destructive flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          bind:value={subject}
        >
          {#each pronouns as pronoun}
            <option value={pronoun.id}>{pronoun.subject}</option>
          {/each}
        </select>
      </div>

      <div class="flex flex-col w-full items-center">
        <label for="subject">Object</label>
        <select
          id="subject"
          class="border-input bg-background ring-offset-background focus-visible:ring-ring aria-[invalid]:border-destructive flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          bind:value={object}
        >
          {#each pronouns as pronoun}
            <option value={pronoun.id}>{pronoun.object}</option>
          {/each}
        </select>
      </div>
    </div>
    <div class="space-y-2 mt-2 flex flex-col">
      <Button variant="default" onclick={handleSetPronouns}>Set</Button>
      <Button variant="destructive" onclick={handleRemovePronouns}>
        Remove
      </Button>
      {#if errored}
        <p class="text-red-500">
          Could not set pronouns, please try again later or contact support
        </p>
      {/if}
    </div>
  {/snippet}
</Modal>
