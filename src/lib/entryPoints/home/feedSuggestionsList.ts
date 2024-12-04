import FeedSuggestionsList from "@/lib/components/app/FeedSuggestionsList.svelte";
import { sharedState } from "@/lib/state/state.svelte";
import { mount, unmount } from "svelte";

const attachedClass = "ftv-feed-suggestions-list-watch-button-attached";

export async function feedSuggestionsList(ctx: any, mutation: MutationRecord) {
  const feedSuggestionsList = mutation.target as HTMLElement;
  if (
    !feedSuggestionsList ||
    !feedSuggestionsList.classList.contains("feed-suggestions-list")
  ) {
    return;
  }

  if (feedSuggestionsList.children.length === 0) {
    return;
  }

  const preparedLiveCreators = [];
  const feedHeaders = feedSuggestionsList.querySelectorAll(
    "* .feed-suggestion-header",
  );

  for (const feedHeader of feedHeaders) {
    if (!feedHeader || feedHeader.children.length === 0) {
      continue;
    }

    const watchButton = feedHeader.children[
      feedHeader.children.length - 1
    ] as HTMLDivElement;

    if (
      !watchButton ||
      watchButton.innerText.trim().toLowerCase() !== "watch"
    ) {
      continue;
    }

    if (watchButton.classList.contains(attachedClass)) {
      continue;
    }

    const usernameElement = feedHeader.querySelector(
      "* .username-wrapper",
    ) as HTMLAnchorElement;
    if (!usernameElement || usernameElement.href.length === 0) {
      continue;
    }

    watchButton.classList.add(attachedClass);

    preparedLiveCreators.push({
      url: usernameElement.href.split("/").pop() || "",
      watchButton: watchButton,
    });
  }

  if (preparedLiveCreators.length === 0) {
    return;
  }

  const onlineAccounts = await sharedState.getOnlineAccounts();
  if (!onlineAccounts) {
    return;
  }

  for (const liveCreator of preparedLiveCreators) {
    const username = liveCreator.url.replaceAll("/", "").toLowerCase();
    const onlineCreator = onlineAccounts.find(
      (creator) => creator.username.toLowerCase() === username,
    );

    if (!onlineCreator) {
      console.warn("Could not find online creator", username);
      continue;
    }

    const ui = await createShadowRootUi(ctx, {
      name: "ftv-feed-suggestions-list",
      position: "inline",
      append: "last",
      anchor: liveCreator.watchButton,
      onMount: (container) => {
        const app = mount(FeedSuggestionsList, {
          target: container,
          props: {
            startedAt: onlineCreator.streaming.channel.stream.startedAt,
          },
        });

        return app;
      },
      onRemove: (app: any) => {
        unmount(app);
      },
    });

    ui.uiContainer.classList.add("dark");
    ui.mount();
  }
}
