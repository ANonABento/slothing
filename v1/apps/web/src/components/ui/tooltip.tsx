"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Shadcn-style wrapper around `@radix-ui/react-tooltip`. The pieces
 * compose:
 *
 *   <TooltipProvider>            // once, near the app shell
 *     <Tooltip>                  // per-tooltip root
 *       <TooltipTrigger asChild>{anchor}</TooltipTrigger>
 *       <TooltipContent>{label}</TooltipContent>
 *     </Tooltip>
 *   </TooltipProvider>
 *
 * For the common "show label only when this element collapses" case
 * (sidebar rail items, icon-only buttons), use `<ConditionalTooltip>`
 * — it avoids the Tooltip plumbing at the call site.
 */

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-w-xs overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-xs leading-5 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

interface ConditionalTooltipProps {
  /** Render the tooltip only when this is true; otherwise pass children through bare. */
  when: boolean;
  label: ReactNode;
  /** Side relative to the trigger. Defaults to "right" (sidebar rail use case). */
  side?: ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>["side"];
  /** The anchor element. Must be a single React element that forwards refs (Radix uses Slot). */
  children: ReactElement;
}

/**
 * Convenience wrapper: drops the entire Radix tooltip plumbing when
 * `when` is false. Useful in sidebar rail / icon-only modes where the
 * tooltip should only exist while labels are hidden.
 */
export function ConditionalTooltip({
  when,
  label,
  side = "right",
  children,
}: ConditionalTooltipProps) {
  if (!when) return children;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{label}</TooltipContent>
    </Tooltip>
  );
}
