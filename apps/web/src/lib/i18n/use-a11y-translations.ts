"use client";

import { useTranslations } from "next-intl";
import enMessages from "@/messages/en.json";

type A11yKey = keyof typeof enMessages.a11y;
type A11yTranslator = (key: A11yKey) => string;

const fallbackA11yT: A11yTranslator = (key) => enMessages.a11y[key] ?? key;

export function useA11yTranslations() {
  try {
    return useTranslations("a11y") as A11yTranslator;
  } catch {
    return fallbackA11yT;
  }
}
