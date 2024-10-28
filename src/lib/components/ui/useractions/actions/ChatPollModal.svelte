<script lang="ts">
  import { fanslyApi } from "@/lib/api/fansly.svelte";
  import { formatZodErrorMessage } from "@/lib/helpers";
  import { sharedState } from "@/lib/state/state.svelte";
  import { ActionType } from "@/lib/types";
  import { Plus, Trash } from "lucide-svelte";
  import { z, ZodError, ZodIssue } from "zod";
  import Button from "../../button/button.svelte";
  import Input from "../../input/input.svelte";
  import Label from "../../label/label.svelte";
  import Modal from "../../modal/Modal.svelte";

  interface Props {
    action: ActionType;
  }

  let { action = $bindable() }: Props = $props();

  let title: string = $state("");
  let time: number = $state(1);
  let options: string[] = $state(["", ""]);
  let validtionErrors: ZodError<any> | null = $state(null);

  const Poll = z.object({
    Title: z
      .string()
      .max(1024)
      .min(1)
      .regex(/^[^|]*$/, "Cannot contain '|'"),
    Time: z.number().int().positive().max(60),
    Options: z
      .array(
        z
          .string()
          .max(1024)
          .min(1)
          .regex(/^[^|]*$/, "Cannot contain '|'"),
      )
      .min(2),
  });

  function onClose() {
    action = ActionType.None;
  }

  async function onCreatePoll() {
    try {
      const poll = Poll.parse({ Title: title, Time: time, Options: options });
      validtionErrors = null;

      // const startPollUsage = "Usage: !poll start POLL TITLE|MINUTES|OPTION 1|OPTION 2|..."

      const result = await fanslyApi.sendChatMessage(
        sharedState.chatroomId!,
        `!poll start ${poll.Title}|${poll.Time}|${poll.Options.join("|")}`,
      );
      if (!result) {
        validtionErrors = new ZodError([
          {
            message: "Failed to create poll, please try again later.",
            path: ["sendChatMessage"],
          } as ZodIssue,
        ]);
        return;
      }

      onClose();
    } catch (error: any) {
      validtionErrors = error as ZodError<typeof Poll>;
    }
  }
</script>

<Modal showModal={true} {onClose}>
  {#snippet header()}
    <h2>Chat Poll</h2>
  {/snippet}

  {#snippet body()}
    {@const generalErrorMessage = formatZodErrorMessage(
      validtionErrors,
      "sendChatMessage",
    )}
    {@const titleErrorMessage = formatZodErrorMessage(validtionErrors, "title")}
    {@const timeErrorMessage = formatZodErrorMessage(validtionErrors, "time")}

    <div class="flex flex-col space-y-2">
      <Label for="title">Poll Title</Label>
      <Input
        type="text"
        id="title"
        placeholder="Enter poll title"
        bind:value={title}
      />
      {#if titleErrorMessage}
        <p class="text-red-500 text-xs">{titleErrorMessage}</p>
      {/if}
      <Label for="time">Time</Label>
      <Input
        type="number"
        id="time"
        placeholder="Enter time in minutes"
        bind:value={time}
      />
      {#if timeErrorMessage}
        <p class="text-red-500 text-xs">{timeErrorMessage}</p>
      {/if}
      <div class="flex justify-between items-center">
        <Label for="options">Options</Label>
        <Button
          variant="default"
          size="sm"
          on:click={() => (options = [...options, ""])}
        >
          <Plus size="16" />
        </Button>
      </div>

      <div class="flex flex-col space-y-2">
        {#each options as _, index}
          {@const optionErrorMessage = formatZodErrorMessage(
            validtionErrors,
            `Options.${index}`,
          )}
          <div class="flex space-x-2 items-center">
            <Input
              type="text"
              id="option"
              placeholder="Enter option"
              bind:value={options[index]}
            />
            {#if index > 1}
              <Button
                variant="destructive"
                size="sm"
                on:click={() =>
                  (options = options.filter((_, i) => i !== index))}
              >
                <Trash size="16" />
              </Button>
            {/if}
          </div>
          {#if optionErrorMessage}
            <p class="text-red-500 text-xs">{optionErrorMessage}</p>
          {/if}
        {/each}
      </div>

      <hr />

      {#if generalErrorMessage}
        <p class="text-red-500 text-xs">{generalErrorMessage}</p>
      {/if}
      <div class="flex justify-end space-x-2">
        <Button variant="secondary" size="sm" class="w-full" onclick={onClose}>
          Cancel
        </Button>
        <Button
          variant="default"
          size="sm"
          class="w-full"
          onclick={onCreatePoll}>Create Poll</Button
        >
      </div>
    </div>
  {/snippet}
</Modal>
