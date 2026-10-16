import type { LucideIcon } from "lucide-react";
// No Next imports here: the browser extension's popup uses these components too (see extension/).
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(" ");

type Variant = "primary" | "secondary" | "ghost" | "danger";
const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-brand-dark",
  secondary: "border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink-2 hover:bg-rule-bg hover:text-ink",
  danger: "text-ink-3 hover:bg-warn-soft hover:text-warn",
};
export type Size = "md" | "sm";
const sizes: Record<Size, string> = { md: "h-10 px-4 text-sm", sm: "h-8 px-3 text-xs" };

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

/** Button styling, also for <a> elements that look like buttons (never nest a <button> in a link). */
export const buttonClass = (variant: Variant = "secondary", size: Size = "md", className?: string) =>
  cx(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium transition-colors disabled:pointer-events-none disabled:opacity-45",
    focusRing,
    sizes[size],
    variants[variant],
    className,
  );

export function Button({ variant = "secondary", size = "md", className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

/** Square icon-only button. `label` doubles as the accessible name and tooltip. */
export function IconButton({
  label,
  danger,
  size = "md",
  className,
  children,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & { label: string; danger?: boolean; size?: Size }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx(
        "grid shrink-0 place-items-center rounded-control text-ink-3 transition-colors hover:bg-rule-bg disabled:pointer-events-none disabled:opacity-25",
        focusRing,
        size === "md" ? "h-9 w-9" : "h-8 w-8",
        danger ? "hover:text-warn" : "hover:text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/** Shared by Input, Textarea and the Dropdown trigger so every control looks the same. */
export const fieldClass =
  "w-full rounded-control border border-rule-strong bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-3 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft disabled:opacity-60";

export const Input = ({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) => <input className={cx(fieldClass, "h-10", className)} {...p} />;
/**
 * Grows with its content (CSS field-sizing), so long bullets are never clipped. field-sizing ignores
 * `rows`, so `rows` is applied as a minimum height in lines instead (1lh + the field's padding/border).
 */
export const Textarea = ({ className, rows = 1, style, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    rows={rows}
    className={cx(fieldClass, "resize-y leading-relaxed [field-sizing:content]", className)}
    style={{ minHeight: `calc(${rows}lh + 1rem + 2px)`, ...style }}
    {...p}
  />
);

const labelClass = "mb-1.5 block text-xs font-semibold text-ink-2";

/** A label that wraps its control, so the control gets an accessible name without id plumbing. */
export function Field({ label, children, className }: { label: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={cx("block", className)}>
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <label className={cx(labelClass, className)}>{children}</label>;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("font-mono text-eyebrow uppercase text-ink-3", className)}>{children}</div>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("rounded-card border border-rule bg-paper shadow-paper", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cx("font-display text-lg font-semibold tracking-tight", className)}>{children}</h2>;
}

/** A recessed sub-panel inside a Card (one role, one project, one included entry). */
export function Inset({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("rounded-control border border-rule bg-page p-4", className)}>{children}</div>;
}

/** The small bordered icon square used by page headers and empty states. */
export function IconTile({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <div className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-control border border-rule bg-page-2 text-ink", className)}>
      <Icon className="h-[18px] w-[18px]" />
    </div>
  );
}

export function EmptyState({ icon, title, children, footer }: { icon: LucideIcon; title: ReactNode; children?: ReactNode; footer?: ReactNode }) {
  return (
    <Card className="flex flex-col items-center gap-2 px-6 py-12 text-center">
      <IconTile icon={icon} />
      <CardTitle>{title}</CardTitle>
      {children && <div className="max-w-sm text-sm text-ink-2">{children}</div>}
      {footer && <div className="mt-3 max-w-2xl">{footer}</div>}
    </Card>
  );
}

/* v1's segmented control: dark block marks the active option. Buttons (client state) or links (URL state). */
export const segmentGroup = "inline-flex rounded-control border border-rule bg-paper p-1 shadow-paper";
export const segmentItem = (active: boolean, size: Size) =>
  cx(
    "flex items-center whitespace-nowrap rounded-chip font-medium transition-colors",
    focusRing,
    size === "md" ? "h-8 px-4 text-sm" : "h-7 px-3 text-xs",
    active ? "bg-ink text-paper" : "text-ink-2 hover:text-ink",
  );

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
}: {
  options: { value: T; label: ReactNode }[];
  value: T | null;
  onChange: (v: T) => void;
  size?: Size;
}) {
  return (
    <div className={segmentGroup}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)} className={segmentItem(value === o.value, size)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

const STATUS_TONE: Record<string, string> = {
  saved: "border-rule bg-page text-ink-2",
  applied: "border-rule-strong bg-paper text-ink",
  interviewing: "border-brand bg-brand-soft text-brand-dark",
  offer: "border-ok bg-ok-soft text-ok",
  rejected: "border-rule bg-page text-ink-3",
  archived: "border-rule bg-page text-ink-3",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={cx("inline-flex h-6 items-center rounded-chip border px-2 text-xs font-medium capitalize", STATUS_TONE[status] ?? STATUS_TONE.saved)}>
      {status}
    </span>
  );
}

export function Warnings({ items }: { items: { where: string; message: string }[] }) {
  if (!items.length) return null;
  return (
    <div className="rounded-control border border-warn bg-warn-soft px-4 py-3 text-sm">
      <div className="mb-1 font-semibold text-warn">Check before sending · {items.length}</div>
      <ul className="list-disc space-y-0.5 pl-5 text-ink-2">
        {items.map((w, i) => (
          <li key={i}>
            <span className="text-ink-3">{w.where}:</span> {w.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
