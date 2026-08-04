const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(status: number, message: string, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}

function buildUrl(path: string, params?: RequestOptions["params"]): string {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function request<TResponse>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<TResponse> {
  const response = await fetch(buildUrl(path, options?.params), {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: options?.signal,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && "message" in payload && String(payload.message)) ||
      response.statusText;
    throw new ApiError(response.status, message, payload);
  }

  return payload as TResponse;
}

export const api = {
  get: <TResponse>(path: string, options?: RequestOptions) =>
    request<TResponse>("GET", path, undefined, options),
  post: <TResponse>(path: string, body?: unknown, options?: RequestOptions) =>
    request<TResponse>("POST", path, body, options),
  put: <TResponse>(path: string, body?: unknown, options?: RequestOptions) =>
    request<TResponse>("PUT", path, body, options),
  patch: <TResponse>(path: string, body?: unknown, options?: RequestOptions) =>
    request<TResponse>("PATCH", path, body, options),
  delete: <TResponse>(path: string, options?: RequestOptions) =>
    request<TResponse>("DELETE", path, undefined, options),
};
