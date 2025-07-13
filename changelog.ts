import { Changelog } from '@/lib/types';

export const changelog: Changelog[] = [
  {
    version: '2.0.18',
    date: '7/13/2025',
    changes: `
- added support for Fansly stream titles and uptimes in feed suggestions list
- added emote suggestions to chat input
- fixed emotes not showing up in chat when using new lines
`
  },
  {
    version: '2.0.17',
    date: '7/6/2025',
    changes: `
- fixed extension icon
`
  },
  {
    version: '2.0.16',
    date: '7/6/2025',
    changes: `
- added support for username paints per chatroom
`
  },
  {
    version: '2.0.15',
    date: '6/29/2025',
    changes: `
- added support for ZerGo0_Bot emotes
- added support for ZerGo0_Bot badges
- added support for ZerGo0_Bot username paint
`
  },
  {
    version: '2.0.14',
    date: '6/5/2025',
    changes: `
- fixed pronouns not showing up in account cards
- removed stream title functionality
`
  },
  {
    version: '2.0.13',
    date: '6/4/2025',
    changes: `
- fixed chat emotes parsing after Fansly's latest update
  - updated selector for finding chat messages
  - improved message text detection
`
  },
  {
    version: '2.0.12',
    date: '1/30/2025',
    changes: `
- you can now click on the view count to toggle it
  - this allows you to blur the view count so that it doesn't show the actual view count
`
  },
  {
    version: '2.0.11',
    date: '1/14/2025',
    changes: `
- stream titles now show spaces correctly
`
  },
  {
    version: '2.0.10',
    date: '1/14/2025',
    changes: `
- fixed rate limit issues
`
  },
  {
    version: '2.0.9',
    date: '1/14/2025',
    changes: `
- fixed wrong emotes/title when switching between streamers
`
  },
  {
    version: '2.0.8',
    date: '1/13/2025',
    changes: `
- added support for stream titles
`
  },
  {
    version: '2.0.7',
    date: '12/19/2024',
    changes: `
- fixed uptime not showing up in feed suggestions list
`
  },
  {
    version: '2.0.6',
    date: '12/18/2024',
    changes: `
- updates related to the new Fansly update
  - removed uptime from stream page
  - added uptime to explore page
`
  },
  {
    version: '2.0.5',
    date: '12/17/2024',
    changes: `
- fixed 7TV icon not showing up
- fixed emote provider selector showing wrong "selected" provider sometimes
`
  },
  {
    version: '2.0.4',
    date: '12/04/2024',
    changes: `
- added giveaway modal
- fixed chat emotes not being case sensitive
`
  },
  {
    version: '2.0.3',
    date: '11/01/2024',
    changes: `
- added changelog modal
- fixed "Start Poll" button not showing up for creators in /creator/streaming
`
  },
  {
    version: '2.0.2',
    date: '10/31/2024',
    changes: `
- fixed chat poll modal for creators
  - the button should now actually show up...
- fixed chat emotes breaking a bunch of Fansly's logic
  - "Message deleted" should now work as intended
  - links should not have extra spaces
`
  },
  {
    version: '2.0.1',
    date: '10/18/2024',
    changes: `
- added chat poll modal
  - this will make it easier for you guys to create polls in chat
  - the modal is only available for the chat owners and moderators
- added uptime on /home
`
  },
  {
    version: '2.0.0',
    date: '10/19/2024',
    changes: `
- version 2.0 released for firefox
  - this uses a temporary patch for the issues with the extension
  - github issue for svelte has been opened
`
  },
  {
    version: '2.0.0',
    date: '10/18/2024',
    changes: `
- version 2.0 released
  - rewrote the majority of the extension
  - chrome is only supported for now
    - firefox has some issues with the extension
  - this should make it easier to add new features in the future
- the extension is now fully open source: https://github.com/ZerGo0/Ftv-extension
`
  }
];
