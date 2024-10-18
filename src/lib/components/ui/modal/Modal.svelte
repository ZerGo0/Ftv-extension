<script lang="ts">
  interface Props {
    showModal: boolean;
    header: any;
    body: any;
  }

  let { showModal = $bindable(), header, body }: Props = $props();

  let dialog: HTMLDialogElement | null;

  $effect(() => {
    if (dialog && showModal) dialog.showModal();
    if (dialog && !showModal) dialog.close();
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this={dialog}
  onclose={() => (showModal = false)}
  onclick={(e) => {
    if (e.target === dialog) {
      showModal = false;
    }
  }}
  class="bg-popover text-fansly-font-1 rounded-lg max-w-[32rem]"
>
  <div class="p-4">
    {@render header()}
    <hr class="my-2" />
    {@render body()}
  </div>
</dialog>

<style>
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }

  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }

  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
