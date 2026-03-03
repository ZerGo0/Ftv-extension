<script lang="ts">
  import {
    applyEmoteProviderTweaks,
    emoteTweakSettings,
    emoteProviderTypeLabels,
    emoteProviderToggleTypes,
    type EmoteProviderToggleType
  } from '@/lib/emotes/tweaks.svelte';
  import { ActionType } from '@/lib/types';
  import Modal from '../../modal/Modal.svelte';
  import { Switch } from '../../switch';

  interface Props {
    action: ActionType;
  }

  let { action = $bindable() }: Props = $props();

  const configSections = [
    {
      id: 'emotes',
      title: 'Emotes',
      description: 'Choose which emote providers are enabled.'
    }
  ] as const;

  const emoteProviderOptions = emoteProviderToggleTypes.map((type) => ({
    type,
    label: emoteProviderTypeLabels[type]
  }));

  function onClose() {
    action = ActionType.None;
  }

  function onToggleEmoteProvider(type: EmoteProviderToggleType) {
    const enabled = !emoteTweakSettings.emoteProviders[type];
    emoteTweakSettings.setEmoteProviderEnabled(type, enabled);
    applyEmoteProviderTweaks();
  }
</script>

<Modal showModal={true} {onClose}>
  {#snippet header()}
    <h2>Config</h2>
  {/snippet}

  {#snippet body()}
    <div class="flex flex-col space-y-4">
      {#each configSections as section}
        <section class="rounded-md border border-input p-3" id="config-section-{section.id}">
          <h3 class="text-sm font-semibold">{section.title}</h3>
          <p class="mb-3 text-xs text-muted-foreground">{section.description}</p>

          {#if section.id === 'emotes'}
            <div class="flex flex-col space-y-3">
              {#each emoteProviderOptions as option}
                <div class="flex items-center justify-between">
                  <span class="text-sm">{option.label}</span>
                  <Switch
                    checked={emoteTweakSettings.emoteProviders[option.type]}
                    on:click={() => onToggleEmoteProvider(option.type)}
                  />
                </div>
              {/each}
            </div>
          {/if}
        </section>
      {/each}
    </div>
  {/snippet}
</Modal>
