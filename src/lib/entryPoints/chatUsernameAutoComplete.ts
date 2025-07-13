const attachedClass = 'ftv-chat-username-auto-complete-attached';
export const usernamesCache = new Map<string, string>();

let originalUsername: string | null = null;

export async function chatUsernameAutoComplete(ctx: any, mutation: MutationRecord) {
  const element = mutation.target as HTMLElement;
  if (!element || !element.tagName || element.tagName !== 'APP-CHAT-ROOM') {
    return;
  }

  const chatInput = element.querySelector(
    'app-chat-room > .chat-footer > * > .message-input-container > textarea'
  ) as HTMLTextAreaElement;

  if (!chatInput || chatInput.classList.contains(attachedClass)) {
    return;
  }

  chatInput.classList.add(attachedClass);

  chatInput.addEventListener('keydown', (e: any) => {
    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        const username = chatInput.value.split(' ').pop();

        if (!username || username.length === 0 || username[0] !== '@') {
          return;
        }

        if (
          originalUsername !== null &&
          !username.substring(1).toLowerCase().startsWith(originalUsername.toLowerCase())
        ) {
          originalUsername = null;
        }

        autoCompleteUsername(username, chatInput);
        break;
      case 'Enter':
        originalUsername = null;
        break;
    }
  });
}

function autoCompleteUsername(inputUsername: string, chatInput: HTMLTextAreaElement) {
  if (usernamesCache.size === 0) {
    return;
  }

  const currentUsername = inputUsername.substring(1).toLowerCase();
  let usernameWithoutAt = currentUsername;

  if (originalUsername !== null) {
    usernameWithoutAt = originalUsername;
  }

  // Get all usernames that start with the input username
  const matchingUsernames = Array.from(usernamesCache).filter((username) =>
    username[0].startsWith(usernameWithoutAt.toLowerCase())
  );

  if (matchingUsernames.length === 0) {
    return;
  }

  if (originalUsername === null) {
    originalUsername = usernameWithoutAt;
  }

  // get the longest matching username, but not the one that was already input
  const prefix = matchingUsernames
    .filter((username) => username[0] !== currentUsername)
    .reduce((a, b) => (a[0].length > b[0].length ? a : b))[1];

  // Replace the input username with the prefix
  const text = chatInput.value.slice(0, chatInput.value.lastIndexOf('@') + 1) + prefix;
  chatInput.value = text;
  chatInput.dispatchEvent(new Event('input'));
}
