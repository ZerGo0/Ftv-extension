export function findElementFromMutation(
  mutation: MutationRecord,
  selector: string
): HTMLElement | null {
  const targetElement = mutation.target instanceof Element ? mutation.target : null;
  const targetMatch = resolveElement(targetElement, selector);
  if (targetMatch) {
    return targetMatch;
  }

  const targetDescendantMatch = targetElement?.querySelector(selector);
  if (targetDescendantMatch instanceof HTMLElement) {
    return targetDescendantMatch;
  }

  for (const node of mutation.addedNodes) {
    if (!(node instanceof Element)) {
      continue;
    }

    const nodeMatch = resolveElement(node, selector);
    if (nodeMatch) {
      return nodeMatch;
    }

    const nestedMatch = node.querySelector(selector);
    if (nestedMatch instanceof HTMLElement) {
      return nestedMatch;
    }
  }

  return null;
}

function resolveElement(element: Element | null, selector: string): HTMLElement | null {
  if (!element) {
    return null;
  }

  if (element.matches(selector)) {
    return element instanceof HTMLElement ? element : null;
  }

  const closestMatch = element.closest(selector);
  if (!(closestMatch instanceof HTMLElement)) {
    return null;
  }

  return closestMatch;
}
