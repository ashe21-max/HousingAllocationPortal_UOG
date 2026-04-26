const API_BASE_URL = "/api";

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    // Check if response is HTML (error page) instead of JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      // Return null instead of throwing error to allow graceful fallback
      return null as T;
    }

    const payload = (await response.json().catch(() => null)) as
      | { message?: string; code?: string }
      | T
      | null;

    if (!response.ok) {
      const errorPayload = payload as { message?: string; code?: string } | null;
      throw new ApiError(
        errorPayload?.message ?? "Request failed",
        response.status,
        errorPayload?.code,
      );
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors or server not running
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError(
        "Network error",
        0,
        "NETWORK_ERROR"
      );
    }
    
    throw new ApiError(
      "Request failed",
      0,
      "UNKNOWN_ERROR"
    );
  }
}
