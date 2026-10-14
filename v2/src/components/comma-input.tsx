"use client";

import { useEffect, useRef, useState, type InputHTMLAttributes } from "react";

import { Input } from "./ui";

/**
 * A comma-separated list edited as free text. The raw string is kept while typing and parsed on blur,
 * so the caret never jumps and commas can be typed freely.
 */
export function CommaInput({
  value,
  onChange,
  ...rest
}: { value: string[]; onChange: (v: string[]) => void } & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  const [raw, setRaw] = useState(value.join(", "));
  const focused = useRef(false);
  // Pick up outside changes (import, discard) unless the user is mid-edit.
  useEffect(() => {
    if (!focused.current) setRaw(value.join(", "));
  }, [value]);
  const commit = (s: string) => onChange(s.split(",").map((x) => x.trim()).filter(Boolean));
  return (
    <Input
      {...rest}
      value={raw}
      onFocus={() => (focused.current = true)}
      onChange={(e) => {
        setRaw(e.target.value);
        commit(e.target.value);
      }}
      onBlur={() => {
        focused.current = false;
        setRaw(value.join(", "));
      }}
    />
  );
}
