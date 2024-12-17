import { Changelog } from "@/lib/types";

export const changelog: Changelog[] = [
  {
    version: "2.0.5",
    date: "12/17/2024",
    changes: `
- fixed 7TV icon not showing up
- fixed emote provider selector showing wrong "selected" provider sometimes
`,
  },
  {
    version: "2.0.4",
    date: "12/04/2024",
    changes: `
- added giveaway modal
- fixed chat emotes not being case sensitive
`,
  },
  {
    version: "2.0.3",
    date: "11/01/2024",
    changes: `
- added changelog modal
- fixed "Start Poll" button not showing up for creators in /creator/streaming
`,
  },
  {
    version: "2.0.2",
    date: "10/31/2024",
    changes: `
- fixed chat poll modal for creators
  - the button should now actually show up...
- fixed chat emotes breaking a bunch of Fansly's logic
  - "Message deleted" should now work as intended
  - links should not have extra spaces
`,
  },
  {
    version: "2.0.1",
    date: "10/18/2024",
    changes: `
- added chat poll modal
  - this will make it easier for you guys to create polls in chat
  - the modal is only available for the chat owners and moderators
- added uptime on /home
`,
  },
  {
    version: "2.0.0",
    date: "10/19/2024",
    changes: `
- version 2.0 released for firefox
  - this uses a temporary patch for the issues with the extension
  - github issue for svelte has been opened
`,
  },
  {
    version: "2.0.0",
    date: "10/18/2024",
    changes: `
- version 2.0 released
  - rewrote the majority of the extension
  - chrome is only supported for now
    - firefox has some issues with the extension
  - this should make it easier to add new features in the future
- the extension is now fully open source: https://github.com/ZerGo0/Ftv-extension
`,
  },
];
