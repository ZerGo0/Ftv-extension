<script lang="ts">
  import { setExtensionVersion } from '@/lib/helpers';
  import type { Changelog } from '@/lib/types';
  import { ActionType } from '@/lib/types';
  import { changelog } from '../../../../../../changelog';
  import Codeblock from '../../codeblock/codeblock.svelte';
  import Modal from '../../modal/Modal.svelte';

  interface Props {
    action: ActionType;
  }

  let { action = $bindable() }: Props = $props();

  const sortedChangelog = changelog
    .sort((a, b) => {
      // Split version numbers into parts
      const aParts = a.version.split('.').map(Number);
      const bParts = b.version.split('.').map(Number);

      // Compare each version part
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aNum = aParts[i] || 0;
        const bNum = bParts[i] || 0;
        if (aNum !== bNum) {
          return bNum - aNum; // Descending order
        }
      }

      // If versions are equal, sort by date
      return b.date.localeCompare(a.date);
    })
    .map((change) => {
      return cleanupChangelog(change);
    });

  function cleanupChangelog(change: Changelog): Changelog {
    const changeSplit = change.changes.split('\n');
    if (changeSplit[0].trim() !== '') {
      // add a new line before the first line to fix code/pre spacing
      changeSplit.unshift('');
    }

    if (changeSplit[changeSplit.length - 1].trim() === '') {
      changeSplit.pop();
    }

    change.changes = changeSplit.join('\n');

    return change;
  }

  onMount(() => {
    setExtensionVersion();
  });

  function onClose() {
    action = ActionType.None;
  }
</script>

<Modal showModal={true} {onClose} class="no-scroll">
  {#snippet header()}
    <h2>Changelog</h2>
  {/snippet}

  {#snippet body()}
    {#each sortedChangelog as change, i}
      {#if i > 0}
        <hr />
      {/if}

      <div class="flex flex-col">
        <h3 class="text-lg font-bold">{change.version}</h3>
        <p class="text-sm text-gray-500">{change.date}</p>
        <Codeblock code={change.changes} />
      </div>
    {/each}
  {/snippet}
</Modal>
