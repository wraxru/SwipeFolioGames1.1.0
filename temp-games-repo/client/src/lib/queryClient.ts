import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Extract base URL (first element) and parameters (remaining elements)
    const baseUrl = queryKey[0] as string;
    const params = queryKey.slice(1);
    
    // Construct URL with query parameters if needed
    let url = baseUrl;
    if (params.length > 0 && params[0] !== undefined && params[0] !== null) {
      // If baseUrl contains path parameters, assume first param is for path
      if (baseUrl.includes('/:')) {
        url = baseUrl.replace(/\/:[^/]+/, `/${params[0]}`);
        
        // Add remaining params as query parameters if any
        if (params.length > 1) {
          const searchParams = new URLSearchParams();
          for (let i = 1; i < params.length; i++) {
            if (params[i] !== undefined && params[i] !== null) {
              searchParams.append(`param${i}`, params[i] as string);
            }
          }
          if ([...searchParams].length > 0) {
            url += `?${searchParams.toString()}`;
          }
        }
      } else {
        // No path parameters, use query string format for all params
        const searchParams = new URLSearchParams();
        searchParams.append('symbol', params[0] as string);
        
        // Add additional parameters if any
        for (let i = 1; i < params.length; i++) {
          if (params[i] !== undefined && params[i] !== null) {
            if (i === 1 && baseUrl.includes('/intraday')) {
              // For intraday endpoint, second param is interval
              searchParams.append('interval', params[i] as string);
            } else {
              searchParams.append(`param${i}`, params[i] as string);
            }
          }
        }
        url += `?${searchParams.toString()}`;
      }
    }
    
    const res = await fetch(url, {
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
