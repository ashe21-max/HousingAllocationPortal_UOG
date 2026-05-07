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

    const contentType = response.headers.get("content-type");
    const responseText = await response.text().catch(() => "");

    let payload: { message?: string; code?: string } | T | string | null = null;
    if (responseText) {
      try {
        payload = JSON.parse(responseText);
      } catch {
        payload = responseText;
      }
    }

    if (!response.ok) {
      const errorPayload =
        typeof payload === "object" && payload !== null && "message" in payload
          ? payload as { message?: string; code?: string }
          : null;
      const errorMessage =
        errorPayload?.message ??
        (typeof payload === "string" ? payload : response.statusText ?? "Request failed");

      throw new ApiError(errorMessage, response.status, errorPayload?.code);
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
