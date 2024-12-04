import { mount, unmount } from "svelte";
import Uptime from "../components/app/Uptime.svelte";

const attachedClass = "ftv-uptime-attached";

export async function uptime(ctx: any, mutation: MutationRecord) {
  const elem = mutation.target as HTMLElement;
  if (
    !elem ||
    // TODO: find more unique selector
    !elem.classList.contains("stream-info") ||
    elem.classList.contains(attachedClass)
  ) {
    return;
  }

  elem.classList.add(attachedClass);

  const ui = await createShadowRootUi(ctx, {
    name: "ftv-uptime-ui",
    position: "inline",
    append: "last",
    anchor: elem,
    onMount: (container) => {
      const app = mount(Uptime, {
        target: container,
        props: {
          // siteDocument: document,
          // siteWindow: window,
          siteLocalStorage: localStorage,
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
