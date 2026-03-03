type MutationProcessor = (mutation: MutationRecord) => Promise<void> | void;

interface ObserveSerializedMutationsOptions {
  pathWhitelist?: RegExp[];
  processMutation: MutationProcessor;
  target: Node;
  config: MutationObserverInit;
  onError?: (error: unknown) => void;
}

export function observeSerializedMutations({
  pathWhitelist,
  processMutation,
  target,
  config,
  onError
}: ObserveSerializedMutationsOptions) {
  const mutationQueue: MutationRecord[] = [];
  let processingMutationQueue = false;

  const processMutationQueue = async () => {
    if (processingMutationQueue) {
      return;
    }

    processingMutationQueue = true;

    try {
      while (mutationQueue.length > 0) {
        if (pathWhitelist && pathWhitelist.length > 0) {
          const urlPath = window.location.pathname;
          const isWhitelisted = pathWhitelist.some((path) => path.test(urlPath));
          if (!isWhitelisted) {
            mutationQueue.length = 0;
            return;
          }
        }

        const mutation = mutationQueue.shift();
        if (!mutation) {
          continue;
        }

        await processMutation(mutation);
      }
    } catch (error) {
      onError?.(error);
    } finally {
      processingMutationQueue = false;
      if (mutationQueue.length > 0) {
        void processMutationQueue();
      }
    }
  };

  const observer = new MutationObserver((mutations) => {
    mutationQueue.push(...mutations);
    void processMutationQueue();
  });

  observer.observe(target, config);

  return observer;
}
