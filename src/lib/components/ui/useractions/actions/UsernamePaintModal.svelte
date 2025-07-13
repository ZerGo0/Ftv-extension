<script lang="ts">
  import { fanslyApi } from '@/lib/api/fansly.svelte';
  import { sharedState } from '@/lib/state/state.svelte';
  import { ActionType } from '@/lib/types';
  import { usernamePaintDesigns } from '@/lib/entryPoints/accountCard';
  import Button from '../../button/button.svelte';
  import Label from '../../label/label.svelte';
  import Modal from '../../modal/Modal.svelte';

  interface Props {
    action: ActionType;
  }

  let { action = $bindable() }: Props = $props();

  let selectedPaintId: number = $state(0);
  let previewText: string = $state('Preview');
  let error: string | null = $state(null);

  function onClose() {
    action = ActionType.None;
  }

  async function onSavePaint() {
    error = null;

    try {
      const result = await fanslyApi.sendChatMessage(
        sharedState.chatroomId!,
        `!setpaint ${selectedPaintId}`
      );

      if (!result) {
        error = 'Failed to set username paint, please try again later.';
        return;
      }

      onClose();

      // Reload the page to apply the new username paint
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      error = 'An error occurred while setting username paint.';
      console.error('Error setting username paint:', err);
    }
  }

  $effect(() => {
    // Load userpaint CSS if not already loaded
    const head = document.head;
    if (!head.querySelector('style#ftv-userpaint-css')) {
      import('@/assets/userpaint.css?inline').then((module) => {
        const style = document.createElement('style');
        style.id = 'ftv-userpaint-css';
        style.media = 'screen';
        style.innerHTML = module.default;
        document.head.appendChild(style);
      });
    }
  });

  const selectedDesign = $derived(
    usernamePaintDesigns.find((design) => design.id === selectedPaintId) || usernamePaintDesigns[0]
  );
</script>

<Modal showModal={true} {onClose}>
  {#snippet header()}
    <h2>Set Username Paint</h2>
  {/snippet}

  {#snippet body()}
    <div class="flex flex-col space-y-4">
      <div>
        <Label for="paint-select">Select Username Paint</Label>
        <select
          id="paint-select"
          class="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          bind:value={selectedPaintId}
        >
          {#each usernamePaintDesigns as design}
            <option value={design.id}>{design.id} - {design.name}</option>
          {/each}
        </select>
      </div>

      <div>
        <Label>Preview</Label>
        <div class="mt-2 rounded-md border border-input bg-background p-4">
          <div class="flex items-center justify-center">
            <span
              class="relative inline-block text-lg font-bold {selectedDesign.class
                ? 'userpaints-' + selectedDesign.class
                : ''} {selectedDesign.textClass ? 'userpaints-' + selectedDesign.textClass : ''}"
            >
              {previewText}
              {#if selectedDesign.gif}
                <img
                  src="https://zergo0botcdn.zergo0.dev/assets/{selectedDesign.gif}.gif"
                  alt="Username paint effect"
                  class="userpaints-effect-overlay"
                />
              {/if}
            </span>
          </div>
        </div>
      </div>

      <div>
        <Label for="preview-text">Preview Text</Label>
        <input
          id="preview-text"
          type="text"
          class="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          bind:value={previewText}
          placeholder="Enter preview text"
        />
      </div>

      <hr />

      {#if error}
        <p class="text-xs text-red-500">{error}</p>
      {/if}

      <div class="flex justify-end space-x-2">
        <Button variant="secondary" size="sm" class="w-full" onclick={onClose}>Cancel</Button>
        <Button variant="default" size="sm" class="w-full" onclick={onSavePaint}>Save Paint</Button>
      </div>
    </div>
  {/snippet}
</Modal>
