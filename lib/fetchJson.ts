import { ApiError } from "./apiError";

export async function fetchJson<T>(
  url: string,
  fallbackMessage: string,
): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new ApiError(data?.error ?? fallbackMessage, res.status);
  }
  return res.json();
}
