<script lang="ts">
  import '@/assets/app.pcss';
  import { currentSeasonalEmoteButtonType } from '@/lib/consts';
  import { emoteStore } from '@/lib/emotes/emotes.svelte';
  import { emoteProviderStore } from '@/lib/emotes/providers.svelte';
  import { Provider } from '@/lib/emotes/providers/provider';
  import { sharedState } from '@/lib/state/state.svelte';
  import { Emote, SeasonalEmoteButtonTypes } from '@/lib/types';
  import { SmileIcon } from 'lucide-svelte';
  import { Button } from '../ui/button';
  import EmoteCategory from '../ui/emote/EmoteCategory.svelte';
  import EmoteSelector from '../ui/emote/EmoteSelector.svelte';
  import IconParkOutlineFireworks from '../ui/icons/IconParkOutlineFireworks.svelte';
  import MdiEasterOutline from '../ui/icons/MdiEasterOutline.svelte';
  import MingcuteChristmasHatLine from '../ui/icons/MingcuteChristmasHatLine.svelte';
  import MingcutePumpkinLanternLine from '../ui/icons/MingcutePumpkinLanternLine.svelte';
  import { Input } from '../ui/input';
  import * as Popover from '../ui/popover';
  import SetPronounsButton from '../ui/pronouns/SetPronounsButton.svelte';
  import UpdateDot from '../ui/updatedot/UpdateDot.svelte';
  import ActionsButton from '../ui/useractions/ActionsButton.svelte';

  let shadowRoot: ShadowRoot = document.querySelector('ftv-emotes-ui')!.shadowRoot!;
  let panelOpen = $state(false);
  let twitchUserIconUrl = $derived(
    emoteProviderStore.providers.length > 0
      ? emoteProviderStore.providers.find((p) => p.name === 'Twitch Sub Emotes')?.iconUrl
      : ''
  );
  let visibleProviders: number[] = [];
  let emotesContainer: HTMLDivElement;
  let searchTerm = $state('');
  let searchResult: Emote[] = $derived(searchTerm.length > 0 ? emoteStore.search(searchTerm) : []);
  let emoteButtonElm: HTMLButtonElement;
  let bottom = $state(0);
  let right = $state(0);

  onMount(() => {
    emoteButtonElm = shadowRoot.querySelector('#emote-menu-button') as HTMLButtonElement;
    readjustPosition();
  });

  function isUserProvider(providerName: string): boolean {
    if (providerName.includes('User')) {
      return true;
    }

    return false;
  }

  function onInViewport(e: CustomEvent<any>) {
    const idx = e.detail.index;
    const isIntersecting = e.detail.isIntersecting;

    if (isIntersecting) {
      if (!visibleProviders.includes(idx)) {
        visibleProviders.push(idx);
      }
    } else {
      visibleProviders = visibleProviders.filter((i) => i !== idx);
    }

    const providersMin = Math.min(...visibleProviders);
    sharedState.selectedProvider = providersMin === Infinity ? 1 : providersMin;
  }

  // TODO: refactor this function...
  function onScrollToProvider(idx: number) {
    if (emotesContainer.children.length === 0) {
      console.warn('Emote container has no childrens');
      return;
    }

    // The category is the data-index of the category,
    // but emotesContainer.children might not be in the same order
    // as the categories, so we need to find the correct child
    // We need to count which child it is
    let childIndex = 0;
    for (let i = 0; i < emotesContainer.children.length; i++) {
      let child = emotesContainer.children[i];
      if (child.getAttribute('data-index') === idx.toString()) {
        childIndex = i;
        break;
      }
    }

    const searchbarInput = shadowRoot.querySelector('#emote-search') as HTMLInputElement;
    if (searchbarInput && searchbarInput.value.length > 0) {
      searchbarInput.value = '';
      searchbarInput.dispatchEvent(new Event('input'));

      setTimeout(() => {
        onScrollToProvider(idx);
      }, 100);
      return;
    }

    const topOffset = (emotesContainer.children[0] as HTMLElement).offsetTop;

    emotesContainer.scrollTo({
      top: (emotesContainer.children[childIndex] as HTMLElement).offsetTop - topOffset,
      behavior: 'smooth'
    });
  }

  // NOTE: Scrolling in mobile size is kinda scuffed, because the div
  // itself gets scrolled, not the window...
  function readjustPosition() {
    adjustBottom();
    adjustRight();
  }

  function adjustBottom() {
    if (!emoteButtonElm) {
      return;
    }

    const screenheight = window.innerHeight;
    const emoteButtonRect = emoteButtonElm.getBoundingClientRect();
    if (screenheight - emoteButtonRect.top >= 0) {
      bottom = screenheight - emoteButtonRect.top + 10;
    } else {
      bottom = emoteButtonRect.top - screenheight + 10;
    }
  }

  function adjustRight() {
    if (!emoteButtonElm) {
      return;
    }

    const screenwidth = window.innerWidth;
    const emoteButtonRect = emoteButtonElm.getBoundingClientRect();
    right = screenwidth - emoteButtonRect.right - 10;
  }

  function onWindowClick(e: MouseEvent) {
    const targetElement = e.target as HTMLElement;
    if (panelOpen && targetElement?.tagName !== 'FTV-EMOTES-UI') {
      panelOpen = false;
    }
  }
</script>

<svelte:window on:scroll={() => (panelOpen = false)} onclick={onWindowClick} />

<Popover.Root
  portal={null}
  closeOnOutsideClick={false}
  bind:open={panelOpen}
  onOpenChange={readjustPosition}
>
  <Popover.Trigger asChild let:builder>
    <div class="relative ml-1 flex items-center" id="emote-menu-button-container">
      <Button builders={[builder]} variant="icon" size="clear" id="emote-menu-button">
        <UpdateDot class="-right-1 -top-1" />

        {#if currentSeasonalEmoteButtonType.type === SeasonalEmoteButtonTypes.NewYears}
          <IconParkOutlineFireworks size="20" />
        {:else if currentSeasonalEmoteButtonType.type === SeasonalEmoteButtonTypes.Easter}
          <MdiEasterOutline size="20" />
        {:else if currentSeasonalEmoteButtonType.type === SeasonalEmoteButtonTypes.Halloween}
          <MingcutePumpkinLanternLine size="20" />
        {:else if currentSeasonalEmoteButtonType.type === SeasonalEmoteButtonTypes.Christmas}
          <MingcuteChristmasHatLine size="20" />
        {:else}
          <SmileIcon size="20" />
        {/if}
      </Button>
    </div>
  </Popover.Trigger>
  <Popover.Content
    style="position: fixed; bottom: {bottom}px; right: {right}px;"
    strategy={'fixed'}
  >
    <header class="mb-2 flex items-center justify-between" id="emote-header">
      <Input placeholder="Search emotes" class="w-full" id="emote-search" bind:value={searchTerm} />
    </header>

    <div class="flex h-full overflow-hidden text-fansly-font-1" id="emotes-body">
      <div
        class="no-scroll flex w-full flex-col overflow-y-auto rounded-l-lg border"
        id="emotes-container"
        bind:this={emotesContainer}
      >
        {#if searchTerm.length > 0}
          <EmoteCategory
            provider={new Provider('Search Result', '', searchResult)}
            index={-1}
            twitchUserIconUrl={''}
            onInViewport={() => {}}
          />
        {:else}
          {#each emoteProviderStore.providers as provider, i}
            <EmoteCategory
              {provider}
              index={i}
              twitchUserIconUrl={isUserProvider(provider.name) && twitchUserIconUrl
                ? twitchUserIconUrl
                : ''}
              {onInViewport}
            />
          {/each}
        {/if}
      </div>
      <div class="flex flex-col rounded-r-lg border border-l-0" id="emote-selector">
        <div
          class="no-scroll flex h-full w-12 flex-col overflow-y-auto"
          id="category-selector-container"
        >
          {#each emoteProviderStore.providers as provider, i}
            <EmoteSelector
              category={provider}
              index={i}
              selectedProvider={sharedState.selectedProvider}
              twitchUserIconUrl={isUserProvider(provider.name) && twitchUserIconUrl
                ? twitchUserIconUrl
                : ''}
              onScrollToProvider={(e) => {
                onScrollToProvider(e.detail.index);
              }}
            />
          {/each}
        </div>
        <div
          class="flex flex-col items-center justify-center border-t text-primary"
          id="category-selector-actions"
        >
          <ActionsButton />
          <SetPronounsButton />
        </div>
      </div>
    </div>
  </Popover.Content>
</Popover.Root>

<style>
</style>
