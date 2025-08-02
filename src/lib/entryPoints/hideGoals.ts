import { sharedState } from '@/lib/state/state.svelte';

const attachedClass = 'ftv-goals-attached';

let hidden = localStorage.getItem('ftv-goals-hidden') === 'true';

export async function hideGoals(ctx: any, mutation: MutationRecord) {
  const elem = mutation.target as HTMLElement;

  // Check if it's a goal element
  if (!elem || elem.tagName !== 'APP-CHAT-ROOM-GOAL' || elem.classList.contains(attachedClass)) {
    return;
  }

  // Don't hide goals on your own stream
  if (sharedState.isOwner) {
    return;
  }

  elem.classList.add(attachedClass);

  const goalElement = elem as HTMLElement;

  if (hidden) {
    hideGoal(goalElement);
  }

  // Add click handler to toggle visibility
  goalElement.style.cursor = 'pointer';
  goalElement.addEventListener('click', (e) => {
    e.stopPropagation();
    hidden = !hidden;
    localStorage.setItem('ftv-goals-hidden', hidden.toString());

    // Apply to all goals on the page
    const allGoals = document.querySelectorAll('app-chat-room-goal');
    allGoals.forEach((goal) => {
      if (hidden) {
        hideGoal(goal as HTMLElement);
      } else {
        showGoal(goal as HTMLElement);
      }
    });
  });
}

function hideGoal(goalElement: HTMLElement) {
  goalElement.classList.add('ftv-goal-blurred');

  // Replace the actual goal amounts with placeholder text
  const amountElements = goalElement.querySelectorAll('[class*="progress"]');
  amountElements.forEach((el) => {
    if (!el.querySelector('.ftv-goal-pseudo')) {
      const originalText = el.textContent;
      if (originalText && originalText.includes('$')) {
        el.classList.add('ftv-goal-amount-hidden');
        const span = document.createElement('span');
        span.textContent = '$??? / $???';
        span.classList.add('ftv-goal-pseudo');
        el.appendChild(span);
      }
    }
  });
}

function showGoal(goalElement: HTMLElement) {
  goalElement.classList.remove('ftv-goal-blurred');

  // Remove placeholder text
  const pseudoElements = goalElement.querySelectorAll('.ftv-goal-pseudo');
  pseudoElements.forEach((el) => el.remove());

  const hiddenElements = goalElement.querySelectorAll('.ftv-goal-amount-hidden');
  hiddenElements.forEach((el) => el.classList.remove('ftv-goal-amount-hidden'));
}

