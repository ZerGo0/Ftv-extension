<script lang="ts">
  import { fanslyApi } from "@/lib/api/fansly.svelte";
  import { zergo0Api } from "@/lib/api/zergo0";
  import Modal from "@/lib/components/ui/modal/Modal.svelte";
  import { ChatPronoun } from "@/lib/types";
  import Button from "../button/button.svelte";

  let showModal = $state(false);
  let errored = $state(false);
  let pronouns: ChatPronoun[] = $state([]);
  let subject = $state(1);
  let object = $state(1);

  const botChatroomdId = "408830844350771200";

  onMount(async () => {
    pronouns = await zergo0Api.getChatPronouns();
    if (pronouns.length === 0) {
      console.error("No pronouns found");
      return;
    }
  });

  async function handleSetPronouns() {
    if (subject === 0 || object === 0) {
      console.error("No pronouns selected");
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

<div class="w-full" id="set-pronouns-button-container">
  <!-- onclick={openModal} -->
  <button
    class="set-pronouns-button w-full flex justify-center items-center backdrop-brightness-125 hover:backdrop-brightness-90 active:backdrop-brightness-90 ease-in-out duration-200"
    title="Set your chat pronouns"
    aria-label="Set your chat pronouns"
    id="set-pronouns-button"
    onclick={() => (showModal = true)}
  >
    <svg
      width="20px"
      height="20px"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 600"
      class="m-2 rounded-md"
    >
      <rect fill="#770088" width="600" height="100" />
      <rect fill="#004CFF" width="600" height="100" y="100" />
      <rect fill="#028121" width="600" height="100" y="200" />
      <rect fill="#FFEE00" width="600" height="100" y="300" />
      <rect fill="#FF8D00" width="600" height="100" y="400" />
      <rect fill="#E50000" width="600" height="100" y="500" />
    </svg>
  </button>
</div>

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
