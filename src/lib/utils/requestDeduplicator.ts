const activeRequests = new Map<string, Promise<Response>>();

function createRequestKey(method: string, url: string, body?: BodyInit | null): string {
  const bodyStr = body ? JSON.stringify(body) : '';
  return `${method}:${url}:${bodyStr}`;
}

export async function deduplicatedFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const url = typeof input === 'string' ? input : input.toString();
  const method = init?.method || 'GET';
  const body = init?.body;

  const requestKey = createRequestKey(method, url, body);

  // Check if request is already in progress
  if (activeRequests.has(requestKey)) {
    const response = await activeRequests.get(requestKey)!;
    // Clone the response so each caller can read the body independently
    return response.clone();
  }

  // Create new request
  const request = fetch(input, init);
  if (method === 'GET') {
    activeRequests.set(requestKey, request);
  }

  // Clean up when done
  request.finally(() => {
    if (activeRequests.has(requestKey)) {
      activeRequests.delete(requestKey);
    }
  });

  const response = await request;
  // Return a clone so the original can be cloned again if needed
  return response.clone();
}
