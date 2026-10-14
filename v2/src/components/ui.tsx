import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(" ");

type Variant = "primary" | "secondary" | "ghost" | "danger";
const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-brand-dark",
  secondary: "border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink-2 hover:bg-rule-bg hover:text-ink",
  danger: "text-ink-3 hover:bg-warn-soft hover:text-warn",
};
type Size = "md" | "sm";
const sizes: Record<Size, string> = { md: "h-10 px-4 text-sm", sm: "h-8 px-3 text-xs" };

export function Button({ variant = "secondary", size = "md", className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-45",
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

const field =
  "w-full rounded-lg border border-rule-strong bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-3 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft";

export const Input = ({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) => <input className={cx(field, "h-10", className)} {...p} />;
export const Textarea = ({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea className={cx(field, "leading-relaxed", className)} {...p} />;
export const Select = ({ className, ...p }: SelectHTMLAttributes<HTMLSelectElement>) => <select className={cx(field, "h-10 w-auto pr-8", className)} {...p} />;

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <label className={cx("mb-1.5 block text-xs font-semibold text-ink-2", className)}>{children}</label>;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3", className)}>{children}</div>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("rounded-xl border border-rule bg-paper shadow-paper", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cx("font-display text-lg font-semibold tracking-tight", className)}>{children}</h2>;
}

/** v1's segmented control: dark pill marks the active option. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
}: {
  options: { value: T; label: ReactNode }[];
  value: T | null;
  onChange: (v: T) => void;
  size?: "md" | "sm";
}) {
  return (
    <div className="inline-flex rounded-lg border border-rule bg-paper p-1 shadow-paper">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cx(
            "rounded-md font-medium transition-colors",
            size === "md" ? "h-9 px-4 text-sm" : "h-7 px-3 text-xs",
            value === o.value ? "bg-ink text-paper" : "text-ink-2 hover:text-ink",
          )}
        >
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
    <span className={cx("inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-medium capitalize", STATUS_TONE[status] ?? STATUS_TONE.saved)}>
      {status}
    </span>
  );
}

export function Warnings({ items }: { items: { where: string; message: string }[] }) {
  if (!items.length) return null;
  return (
    <div className="rounded-lg border border-warn bg-warn-soft px-4 py-3 text-sm">
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
