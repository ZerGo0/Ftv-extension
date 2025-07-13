import { ZodError, ZodIssue } from 'zod';
import { sharedState } from './state/state.svelte';

const extensionVersionKey = 'ftv_version';

export async function waitForElement(selector: string): Promise<Element> {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      const element = document.querySelector(selector);
      if (element) {
        return resolve(element);
      }
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
        }
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

export function formatZodErrorMessage(error: ZodError | null, targetProperty: string): string {
  if (!error) {
    return '';
  }

  const target = error.issues.find(
    (issue: ZodIssue) =>
      issue.path.length > 0 &&
      issue.path.join('.').toLocaleLowerCase() === targetProperty.toLocaleLowerCase()
  );

  if (target) {
    // return `${target.path.join(".")}: ${target.message}`;
    return target.message;
  }

  return '';
}

export function checkIfExtensionVersionIsNewer() {
  const latestVersion = browser.runtime.getManifest().version;
  if (!latestVersion) {
    return false;
  }

  const currentVersion = localStorage.getItem(extensionVersionKey);
  if (!currentVersion) {
    return true;
  }

  return currentVersion !== latestVersion;
}

export function setExtensionVersion() {
  const latestVersion = browser.runtime.getManifest().version;
  if (!latestVersion) {
    console.warn('Could not get extension version');
    return;
  }

  localStorage.setItem(extensionVersionKey, browser.runtime.getManifest().version);

  sharedState.newExtensionVersion = false;

  return;
}
