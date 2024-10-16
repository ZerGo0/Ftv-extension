<script lang="ts">
  // import Modal from 'src/components/Chat/Modal.svelte';
  // import * as h from '../../../../content/helper';

  // let showModal = false;
  // let errored = false;
  // let pronouns: Pronoun[] = [];

  // // pronoun type
  // type Pronoun = {
  //   id: number;
  //   subject: string;
  //   object: string;
  //   singular: boolean;
  // };

  // async function openModal() {
  //   // Fetch pronouns from the server
  //   const response = await fetch('https://zergo0_bot.zergo0.dev/ftv/pronouns');
  //   if (!response.ok) {
  //     h.error('Could not fetch pronouns');
  //     return;
  //   }

  //   const json = await response.json();
  //   if (!json || !json.success) {
  //     h.error('Invalid pronouns response');
  //     return;
  //   }

  //   pronouns = json.response as Pronoun[];

  //   if (pronouns.length === 0) {
  //     h.error('No pronouns found');
  //     return;
  //   }

  //   showModal = true;
  // }

  // async function handleSetPronouns() {
  //   const subject = (document.getElementById('subject') as HTMLSelectElement).value;
  //   const object = (document.getElementById('object') as HTMLSelectElement).value;

  //   const res = await setPronouns(subject, object);

  //   if (res === true) {
  //     setTimeout(() => {
  //       showModal = false;
  //       window.location.reload();
  //     }, 1000);
  //   }
  // }

  // async function handleRemovePronouns() {
  //   const res = await setPronouns('0', '0');

  //   if (res === true) {
  //     setTimeout(() => {
  //       showModal = false;
  //       window.location.reload();
  //     }, 1000);
  //   }
  // }

  // async function setPronouns(subject: string, object: string): Promise<boolean> {
  //   if (!subject || !object) {
  //     h.error('Invalid pronouns', { subject, object });
  //     return false;
  //   }

  //   const result = await sendFanslyMessage(`!setpronouns ${subject} ${object}`);
  //   if (!result) {
  //     h.error('Could not set pronouns');
  //     errored = true;
  //     return false;
  //   }

  //   errored = false;
  //   return true;
  // }

  // async function sendFanslyMessage(message: string): Promise<boolean> {
  //   const session = localStorage.getItem('session_active_session');
  //   if (!session) {
  //     h.error('No session found');
  //     return false;
  //   }

  //   const sessionJson = JSON.parse(session);
  //   const authToken = sessionJson.token;
  //   const fanslyId = sessionJson.accountId;

  //   if (!authToken || !fanslyId) {
  //     h.error('No auth token or fansly id found');
  //     return false;
  //   }

  //   const response = await fetch('https://apiv3.fansly.com/api/v1/chatroom/message', {
  //     method: 'POST',
  //     headers: {
  //       Authorization: authToken,
  //       Referer: 'https://fansly.com/',
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json, text/plain, */*'
  //     },
  //     body: JSON.stringify({
  //       chatRoomId: '408830844350771200',
  //       content: message
  //     }),
  //     referrer: 'https://fansly.com/',
  //     referrerPolicy: 'strict-origin-when-cross-origin',
  //     mode: 'cors',
  //     credentials: 'include'
  //   });

  //   if (!response.ok) {
  //     h.error('Something went wrong, could not make link request');
  //     return false;
  //   }

  //   const data = await response.json();
  //   if (!data?.success) {
  //     h.error('Something went wrong, could not make link request');
  //     return false;
  //   }

  //   return true;
  // }
</script>

<div class="set-pronouns-button-container bg-fwhite w-full">
  <!-- onclick={openModal} -->
  <button
    class="set-pronouns-button w-full flex justify-center items-center backdrop-brightness-125 hover:backdrop-brightness-90 active:backdrop-brightness-90 ease-in-out duration-200"
    title="Set your chat pronouns"
    aria-label="Set your chat pronouns"
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

<!-- <Modal bind:showModal>
  <h2 slot="header">Set your chat pronouns</h2>

  <div class="flex flex-row gap-4 justify-between">
    <div class="flex flex-col w-full items-center">
      <label for="subject">Subject</label>
      <select id="subject" class="w-full p-2 mt-2">
        {#each pronouns as pronoun}
          <option value={pronoun.id}>{pronoun.subject}</option>
        {/each}
      </select>
    </div>
    <div class="flex flex-col w-full items-center">
      <label for="object">Object</label>
      <select id="object" class="w-full p-2 mt-2">
        {#each pronouns as pronoun}
          <option value={pronoun.id}>{pronoun.object}</option>
        {/each}
      </select>
    </div>
  </div>
  <div class="space-y-2 mt-2">
    <button
      id="setbutton"
      class="w-full pt-2 pb-2 block text-white bg-green-500 hover:bg-green-900 rounded-lg"
      on:click={handleSetPronouns}
    >
      Set
    </button>
    <button
      id="removebutton"
      class="w-full pt-2 pb-2 block text-white bg-red-500 hover:bg-red-900 rounded-lg"
      on:click={handleRemovePronouns}
    >
      Remove
    </button>
    {#if errored}
      <p class="text-red-500">
        Could not set pronouns, please try again later or contact support
      </p>
    {/if}
  </div>
</Modal> -->

<style>
  #setbutton:active {
    transform: scale(0.95);
  }

  #removebutton:active {
    transform: scale(0.95);
  }
</style>
