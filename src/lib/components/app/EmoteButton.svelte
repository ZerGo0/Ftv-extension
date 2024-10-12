<script lang="ts">
  import { SmileIcon } from "lucide-svelte";

  interface Props {
    siteDocument: Document;
    siteWindow: Window;
    siteLocalStorage: Storage;
  }

  let { siteDocument, siteWindow, siteLocalStorage }: Props = $props();

  onMount(async () => {
    console.log("EmoteButton mounted");
  });
</script>

<main class="ml-1 flex items-center">
  <button class="text-fansly-darkblue-1 hover:text-fansly-blue-1">
    <SmileIcon size="20" />
  </button>
</main>

<style>
</style>
