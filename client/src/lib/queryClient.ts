import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let text;
    try {
      text = await res.text();
      console.error(`API Error: Status ${res.status} - Response:`, text);
    } catch (e) {
      console.error(`Could not read error response text:`, e);
      text = res.statusText;
    }
    throw new Error(`${res.status}: ${text || res.statusText}`);
  }
}

export async function apiRequest(
  methodOrUrl: string,
  urlOrData?: string | unknown,
  data?: unknown | undefined,
): Promise<any> {
  let method = "GET";
  let url = methodOrUrl;
  let bodyData = data;

  // Handle the case where the first parameter is the HTTP method
  if (methodOrUrl.match(/^(GET|POST|PUT|DELETE|PATCH)$/i)) {
    method = methodOrUrl;
    url = urlOrData as string;
    bodyData = data;
  } else if (urlOrData && typeof urlOrData !== "string") {
    // Handle the case where the first parameter is the URL, second is data
    bodyData = urlOrData;
  }

  console.log(`API Request: ${method} ${url}`);
  if (bodyData) {
    console.log('Request body:', JSON.stringify(bodyData, null, 2));
  }

  try {
    const res = await fetch(url, {
      method,
      headers: bodyData ? { "Content-Type": "application/json" } : {},
      body: bodyData ? JSON.stringify(bodyData) : undefined,
      credentials: "include",
    });

    console.log(`API Response Status: ${res.status} ${res.statusText}`);
    
    await throwIfResNotOk(res);
    
    // Return the parsed JSON directly
    const json = await res.json();
    console.log('API Response Data:', json);
    return json;
  } catch (err) {
    console.error(`API Request Failed: ${method} ${url}`, err);
    throw err;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
