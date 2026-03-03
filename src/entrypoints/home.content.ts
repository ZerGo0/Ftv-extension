import { feedSuggestionsList } from '@/lib/entryPoints/home/feedSuggestionsList';
import { fanslyStyleFixes } from '@/lib/fanslyStyleFixes';
import { sharedState } from '@/lib/state/state.svelte';
import { findElementFromMutation } from '@/lib/utils/findElementFromMutation';
import { observeSerializedMutations } from '@/lib/utils/observeSerializedMutations';

const attachedClass = 'ftv-attached';
const mutationUrlPathWhitelist = [/\/home/, /\/explore\/discover/];
let firstInitPromise: Promise<void> | null = null;
let initializedAppRootElement: HTMLElement | null = null;

export default defineContentScript({
  matches: ['https://fansly.com/*'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    observeSerializedMutations({
      pathWhitelist: mutationUrlPathWhitelist,
      target: document.body,
      config: { childList: true, subtree: true },
      processMutation: async (mutation) => {
        await handleFirstInit(mutation);
        fanslyStyleFixes(ctx);

        feedSuggestionsList(ctx, mutation);
      },
      onError: (error) => {
        console.error('home.content mutation queue failed', error);
      }
    });
  }
});

async function handleFirstInit(mutation: MutationRecord) {
  if (firstInitPromise) {
    await firstInitPromise;
    return;
  }

  const appRootElement = findElementFromMutation(mutation, 'app-root');
  if (!appRootElement) {
    return;
  }

  if (
    appRootElement.classList.contains(attachedClass) &&
    initializedAppRootElement === appRootElement
  ) {
    return;
  }

  appRootElement.classList.add(attachedClass);

  firstInitPromise = (async () => {
    await sharedState.initialize();
    initializedAppRootElement = appRootElement;
  })();

  try {
    await firstInitPromise;
  } finally {
    firstInitPromise = null;
  }
}
