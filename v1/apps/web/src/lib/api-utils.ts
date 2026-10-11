import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";

/**
 * Standard API response utilities for consistent error handling
 */

type ErrorResponseType =
  | "unauthorized"
  | "not_found"
  | "bad_request"
  | "validation_error"
  | "internal_error";

interface ErrorResponse {
  error: string;
  details?: unknown;
}

interface ValidationErrorResponse {
  error: string;
  errors: Array<{ field: string; message: string }>;
}

type ParseBodyResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: NextResponse };

/**
 * Create a standardized error response
 */
export function errorResponse(
  type: ErrorResponseType,
  message?: string,
  details?: unknown,
): NextResponse<ErrorResponse> {
  const defaults: Record<
    ErrorResponseType,
    { message: string; status: number }
  > = {
    unauthorized: { message: "Unauthorized", status: 401 },
    not_found: { message: "Not found", status: 404 },
    bad_request: { message: "Bad request", status: 400 },
    validation_error: { message: "Validation failed", status: 400 },
    internal_error: { message: "Internal server error", status: 500 },
  };

  const { message: defaultMessage, status } = defaults[type];

  const response: ErrorResponse = {
    error: message || defaultMessage,
  };

  if (details !== undefined) {
    response.details = details;
  }

  return NextResponse.json(response, { status });
}

/**
 * Create a validation error response from Zod errors
 */
export function validationErrorResponse(
  error: ZodError,
): NextResponse<ValidationErrorResponse> {
  const errors = error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

  return NextResponse.json(
    {
      error: "Validation failed",
      errors,
    },
    { status: 400 },
  );
}

/**
 * Parse and validate a JSON request body, returning a ready-to-send 400
 * response when the payload is malformed or fails schema validation.
 */
export async function parseJsonBody<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<ParseBodyResult<T>> {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      ),
    };
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return { ok: false, response: validationErrorResponse(parsed.error) };
  }

  return { ok: true, data: parsed.data };
}

export async function parseOptionalJsonBody<T>(
  request: Request,
  schema: ZodType<T>,
  emptyValue: unknown = {},
): Promise<ParseBodyResult<T>> {
  let text: string;

  try {
    text = await request.text();
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      ),
    };
  }

  let json: unknown = emptyValue;
  if (text.trim()) {
    try {
      json = JSON.parse(text);
    } catch {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Invalid JSON body" },
          { status: 400 },
        ),
      };
    }
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return { ok: false, response: validationErrorResponse(parsed.error) };
  }

  return { ok: true, data: parsed.data };
}

export function parseSearchParams<T>(
  searchParams: URLSearchParams,
  schema: ZodType<T>,
): ParseBodyResult<T> {
  const parsed = schema.safeParse(Object.fromEntries(searchParams.entries()));
  if (!parsed.success) {
    return { ok: false, response: validationErrorResponse(parsed.error) };
  }

  return { ok: true, data: parsed.data };
}

/**
 * Create a success response with data
 */
export function successResponse<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

/**
 * Create a success response with a message
 */
export function messageResponse(
  message: string,
  additionalData?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json({
    success: true,
    message,
    ...additionalData,
  });
}

/**
 * Common error responses
 */
export const ApiErrors = {
  unauthorized: () => errorResponse("unauthorized"),
  notFound: (resource: string) =>
    errorResponse("not_found", `${resource} not found`),
  badRequest: (message: string) => errorResponse("bad_request", message),
  internalError: (message?: string) => errorResponse("internal_error", message),
} as const;
