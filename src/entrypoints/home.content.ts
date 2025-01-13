import { feedSuggestionsList } from "@/lib/entryPoints/home/feedSuggestionsList";
import { fanslyStyleFixes } from "@/lib/fanslyStyleFixes";
import { sharedState } from "@/lib/state/state.svelte";

const attachedClass = "ftv-attached";
const mutationUrlPathWhitelist = ["/home", "/explore/discover"];

export default defineContentScript({
  matches: ["https://fansly.com/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    // This needs to be a MutationObserver because of client-side routing
    // When a user navigates to a new page, the actual page is not reloaded
    new MutationObserver(async (mutations) => {
      const urlPath = window.location.pathname;
      const isWhitelisted = mutationUrlPathWhitelist.some((path) =>
        new RegExp(path).test(urlPath),
      );
      if (!isWhitelisted) {
        return;
      }

      mutations.forEach(async (mutation) => {
        handleFirstInit(mutation);
        fanslyStyleFixes(ctx);

        feedSuggestionsList(ctx, mutation);
      });
    }).observe(document.body, { childList: true, subtree: true });
  },
});

async function handleFirstInit(mutation: MutationRecord) {
  const elem = mutation.target as HTMLElement;
  if (
    !elem ||
    elem.tagName !== "APP-ROOT" ||
    elem.classList.contains(attachedClass)
  ) {
    return;
  }

  elem.classList.add(attachedClass);

  await sharedState.initialize();
}
