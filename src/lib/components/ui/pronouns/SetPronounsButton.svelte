<script lang="ts">
  import { fanslyApi } from '@/lib/api/fansly.svelte';
  import { zergo0Api } from '@/lib/api/zergo0';
  import type { ChatPronoun } from '@/lib/types';
  import SetPronounsButtonModal from './SetPronounsButtonModal.svelte';

  let showModal = $state(false);
  let errored = $state(false);
  let pronouns: ChatPronoun[] = $state([]);
  let subject = $state(1);
  let object = $state(1);

  const botChatroomdId = '408830844350771200';

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

<div class="w-full" id="set-pronouns-button-container">
  <!-- onclick={openModal} -->
  <button
    class="set-pronouns-button flex w-full items-center justify-center backdrop-brightness-125 duration-200 ease-in-out hover:backdrop-brightness-90 active:backdrop-brightness-90"
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

<SetPronounsButtonModal bind:showModal />
