import type { ApiResponse } from '@/types/api.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    ...options,
  });

  const json: ApiResponse<T> = await res.json().catch(() => ({
    success: false,
    message: 'Unexpected response from server',
  }));

  if (!res.ok) {
    throw new ApiError(res.status, json.message ?? 'Request failed', json);
  }

  return json as T;
}

export const api = {
  get: <T>(path: string) => apiFetch<ApiResponse<T>>(path),
  post: <T>(path: string, body?: unknown) =>
    apiFetch<ApiResponse<T>>(path, {
      method: 'POST',
      body: JSON.stringify(body ?? {}),
    }),
  put: <T>(path: string, body?: unknown) =>
    apiFetch<ApiResponse<T>>(path, {
      method: 'PUT',
      body: JSON.stringify(body ?? {}),
    }),
  patch: <T>(path: string, body?: unknown) =>
    apiFetch<ApiResponse<T>>(path, {
      method: 'PATCH',
      body: JSON.stringify(body ?? {}),
    }),
  delete: <T>(path: string) => apiFetch<ApiResponse<T>>(path, { method: 'DELETE' }),
};

export { ApiError };
