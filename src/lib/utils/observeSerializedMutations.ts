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
  let mutationQueueReadIndex = 0;
  let processingMutationQueue = false;

  const isPathWhitelisted = () => {
    if (!pathWhitelist || pathWhitelist.length === 0) {
      return true;
    }

    const urlPath = window.location.pathname;
    return pathWhitelist.some((path) => path.test(urlPath));
  };

  const clearMutationQueue = () => {
    mutationQueue.length = 0;
    mutationQueueReadIndex = 0;
  };

  const dequeueMutation = () => {
    if (mutationQueueReadIndex >= mutationQueue.length) {
      return null;
    }

    const mutation = mutationQueue[mutationQueueReadIndex];
    mutationQueueReadIndex += 1;

    if (mutationQueueReadIndex >= mutationQueue.length) {
      clearMutationQueue();
    } else if (
      mutationQueueReadIndex > 1024 &&
      mutationQueueReadIndex * 2 >= mutationQueue.length
    ) {
      mutationQueue.splice(0, mutationQueueReadIndex);
      mutationQueueReadIndex = 0;
    }

    return mutation;
  };

  const processMutationQueue = async () => {
    if (processingMutationQueue) {
      return;
    }

    if (!isPathWhitelisted()) {
      clearMutationQueue();
      return;
    }

    processingMutationQueue = true;

    try {
      while (mutationQueueReadIndex < mutationQueue.length) {
        if (!isPathWhitelisted()) {
          clearMutationQueue();
          return;
        }

        const mutation = dequeueMutation();
        if (!mutation) {
          continue;
        }

        await processMutation(mutation);
      }
    } catch (error) {
      onError?.(error);
    } finally {
      processingMutationQueue = false;
      if (mutationQueueReadIndex < mutationQueue.length) {
        void processMutationQueue();
      }
    }
  };

  const observer = new MutationObserver((mutations) => {
    if (mutations.length === 0) {
      return;
    }

    if (!isPathWhitelisted()) {
      clearMutationQueue();
      return;
    }

    mutationQueue.push(...mutations);
    void processMutationQueue();
  });

  observer.observe(target, config);

  return observer;
}
