import { mount, unmount } from "svelte";
import StreamTitle from "../components/app/StreamTitle.svelte";
import { sharedState } from "../state/state.svelte";

const attachedClass = "ftv-stream-info-attached";

export async function streamInfo(ctx: any, mutation: MutationRecord) {
  const elem = mutation.target as HTMLElement;

  if (
    !elem ||
    elem.tagName !== "APP-ACCOUNT-USERNAME" ||
    !elem.parentElement?.parentElement?.classList.contains("stream-info") ||
    elem.classList.contains(attachedClass)
  ) {
    return;
  }

  elem.classList.add(attachedClass);

  await sharedState.initialize();

  const ui = await createShadowRootUi(ctx, {
    name: "ftv-stream-info-ui",
    position: "inline",
    append: "first",
    anchor: elem,
    onMount: (container) => {
      const app = mount(StreamTitle, {
        target: container,
        props: {
          chatroomId: sharedState.chatroomId,
          creatorId: undefined,
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
