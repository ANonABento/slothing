interface ApiErrorBody {
  error?: unknown;
  message?: unknown;
}

function getApiErrorMessage(body: unknown): string | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const { error, message } = body as ApiErrorBody;
  if (typeof error === "string" && error.trim()) {
    return error;
  }
  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return null;
}

export async function readJsonResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<T> {
  const body = (await response.json().catch((error: unknown) => {
    if (response.ok) {
      throw error;
    }
    return null;
  })) as unknown;

  if (!response.ok) {
    throw new Error(
      getApiErrorMessage(body) || `${fallbackMessage} (${response.status})`,
    );
  }

  return body as T;
}
