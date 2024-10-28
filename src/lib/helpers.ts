import { ZodError, ZodIssue } from "zod";

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
      subtree: true,
    });
  });
}

export function formatZodErrorMessage(
  error: ZodError | null,
  targetProperty: string,
): string {
  if (!error) {
    return "";
  }

  const target = error.issues.find(
    (issue: ZodIssue) =>
      issue.path.length > 0 &&
      issue.path.join(".").toLocaleLowerCase() ===
        targetProperty.toLocaleLowerCase(),
  );

  if (target) {
    // return `${target.path.join(".")}: ${target.message}`;
    return target.message;
  }

  return "";
}
