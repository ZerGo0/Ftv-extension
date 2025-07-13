<script lang="ts">
  import { fanslyApi } from '@/lib/api/fansly.svelte';
  import { formatZodErrorMessage } from '@/lib/helpers';
  import { sharedState } from '@/lib/state/state.svelte';
  import { ActionType } from '@/lib/types';
  import type { ZodIssue } from 'zod';
  import { z, ZodError } from 'zod';
  import Button from '../../button/button.svelte';
  import Input from '../../input/input.svelte';
  import Label from '../../label/label.svelte';
  import Modal from '../../modal/Modal.svelte';

  interface Props {
    action: ActionType;
  }

  let { action = $bindable() }: Props = $props();

  let keyword: string = $state('');
  let time: number = $state(1);
  let subluck: number = $state(1);
  let validtionErrors: ZodError<any> | null = $state(null);

  const Giveaway = z.object({
    keyword: z
      .string()
      .max(256)
      .min(1)
      .regex(/^[a-zA-Z0-9]+$/, 'Must be 1 word'),
    Time: z.number().int().positive().max(60),
    Subluck: z.number().int().positive().max(100)
  });

  function onClose() {
    action = ActionType.None;
  }

  async function onCreateGiveaway() {
    try {
      const giveaway = Giveaway.parse({
        keyword: keyword,
        Time: time,
        Subluck: subluck
      });
      validtionErrors = null;

      const result = await fanslyApi.sendChatMessage(
        sharedState.chatroomId!,
        `!giveaway start ${giveaway.keyword} ${giveaway.Time} ${giveaway.Subluck}`
      );
      if (!result) {
        validtionErrors = new ZodError([
          {
            message: 'Failed to create giveaway, please try again later.',
            path: ['sendChatMessage']
          } as ZodIssue
        ]);
        return;
      }

      onClose();
    } catch (error: any) {
      validtionErrors = error as ZodError<typeof Giveaway>;
    }
  }
</script>

<Modal showModal={true} {onClose}>
  {#snippet header()}
    <h2>Giveaway</h2>
  {/snippet}

  {#snippet body()}
    {@const generalErrorMessage = formatZodErrorMessage(validtionErrors, 'sendChatMessage')}
    {@const keywordErrorMessage = formatZodErrorMessage(validtionErrors, 'keyword')}
    {@const timeErrorMessage = formatZodErrorMessage(validtionErrors, 'time')}
    {@const subluckErrorMessage = formatZodErrorMessage(validtionErrors, 'subluck')}

    <div class="flex flex-col space-y-2">
      <Label for="keyword">Keyword</Label>
      <Input type="text" id="keyword" placeholder="Enter giveaway keyword" bind:value={keyword} />
      {#if keywordErrorMessage}
        <p class="text-xs text-red-500">{keywordErrorMessage}</p>
      {/if}
      <Label for="time">Time</Label>
      <Input type="number" id="time" placeholder="Enter time in minutes" bind:value={time} />
      {#if timeErrorMessage}
        <p class="text-xs text-red-500">{timeErrorMessage}</p>
      {/if}
      <Label for="subluck">Subluck</Label>
      <Input type="number" id="subluck" placeholder="Enter subluck" bind:value={subluck} />
      {#if subluckErrorMessage}
        <p class="text-xs text-red-500">{subluckErrorMessage}</p>
      {/if}

      <hr />

      {#if generalErrorMessage}
        <p class="text-xs text-red-500">{generalErrorMessage}</p>
      {/if}
      <div class="flex justify-end space-x-2">
        <Button variant="secondary" size="sm" class="w-full" onclick={onClose}>Cancel</Button>
        <Button variant="default" size="sm" class="w-full" onclick={onCreateGiveaway}
          >Create Giveaway</Button
        >
      </div>
    </div>
  {/snippet}
</Modal>
