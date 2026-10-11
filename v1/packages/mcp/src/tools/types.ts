import type { z, ZodRawShape } from "zod";
import type { ApiClient } from "../api-client.js";

/**
 * Lightweight description of a tool the server exposes. Each tool owns:
 *   - a Zod raw shape (the SDK calls `.parse` internally)
 *   - a handler that receives validated args + the shared API client
 *   - metadata (description, optional MCP annotations like `readOnlyHint`)
 *
 * Keeping this shape stable lets `server.ts` register every tool uniformly
 * and lets tests target individual handlers in isolation when useful.
 */
export interface ToolDefinition<Shape extends ZodRawShape = ZodRawShape> {
  name: string;
  title: string;
  description: string;
  inputShape: Shape;
  annotations?: {
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
  };
  handler: (args: z.infer<z.ZodObject<Shape>>, client: ApiClient) => Promise<unknown>;
}

/**
 * Type-erased tool: the registry in `tools/index.ts` and the registration
 * loop in `server.ts` both operate on opaque tool definitions. Each tool's
 * handler still gets fully-typed args internally; this widening only happens
 * at the boundary between the registry and the dispatcher.
 */
export type AnyToolDefinition = ToolDefinition<ZodRawShape>;
