<script lang="ts">
  interface Props {
    showModal: boolean;
    header: any;
    body: any;
    onClose?: () => void;
    class?: string;
  }

  let {
    showModal = $bindable(),
    header,
    body,
    onClose = () => {},
    class: className = ''
  }: Props = $props();

  let dialog: HTMLDialogElement | null;

  $effect(() => {
    if (!dialog) {
      return;
    }

    if (showModal) {
      dialog.showModal();
    } else {
      dialog.close();
      onClose();
    }
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
  class="max-w-[32rem] rounded-lg bg-popover text-fansly-font-1 {className}"
>
  <div class="p-4 pt-0">
    <div id="modal-header" class="sticky top-0 bg-popover pt-4 text-lg font-bold">
      {@render header()}

      <hr class="my-2" />
    </div>
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
