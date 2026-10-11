import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

type Variant = "primary" | "secondary" | "ghost" | "danger";
const variants: Record<Variant, string> = {
  primary: "bg-brand text-paper hover:bg-brand-dark",
  secondary: "border border-rule-strong bg-paper text-ink hover:bg-page",
  ghost: "text-ink-2 hover:bg-rule hover:text-ink",
  danger: "text-ink-3 hover:text-warn",
};

export function Button({ variant = "secondary", className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

const field = "w-full rounded-md border border-rule-strong bg-paper px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none";

export const Input = ({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) => <input className={cx(field, className)} {...p} />;
export const Textarea = ({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea className={cx(field, "leading-relaxed", className)} {...p} />;
export const Select = ({ className, ...p }: SelectHTMLAttributes<HTMLSelectElement>) => <select className={cx(field, "w-auto", className)} {...p} />;

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <label className={cx("mb-1 block text-xs font-medium text-ink-2", className)}>{children}</label>;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3", className)}>{children}</div>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("rounded-lg border border-rule bg-paper shadow-paper", className)}>{children}</div>;
}

export function Warnings({ items }: { items: { where: string; message: string }[] }) {
  if (!items.length) return null;
  return (
    <div className="rounded-md border border-warn bg-warn-soft px-3 py-2 text-sm text-ink">
      <div className="mb-1 font-medium text-warn">Check these before sending ({items.length})</div>
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
