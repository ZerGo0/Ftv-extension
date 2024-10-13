<script lang="ts">
  import { emoteStore } from "@/lib/emotes/emotes.svelte";
  import { fanslyProvider } from "@/lib/providers/fansly";
  import { SmileIcon } from "lucide-svelte";

  interface Props {
    siteDocument: Document;
    siteWindow: Window;
    siteLocalStorage: Storage;
  }

  let { siteDocument, siteWindow, siteLocalStorage }: Props = $props();

  const emotes = emoteStore.emotes;

  onMount(async () => {
    console.log("document", document, "window document", window.document);

    console.log("EmoteButton mounted");

    console.log("Button emoteStore len", emotes.length, emotes[0]);

    const test = await fanslyProvider.getChatroomId();

    console.log("getChatroomId", test);
  });
</script>

<main class="ml-1 flex items-center">
  <button class="text-fansly-darkblue-1 hover:text-fansly-blue-1">
    <SmileIcon size="20" />
  </button>
</main>

<style>
</style>
