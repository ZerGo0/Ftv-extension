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
