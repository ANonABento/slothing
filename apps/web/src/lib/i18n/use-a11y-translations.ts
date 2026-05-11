"use client";

import { useMessages, useTranslations } from "next-intl";
import enMessages from "@/messages/en.json";

type A11yKey = keyof typeof enMessages.a11y;

export function useA11yTranslations() {
  try {
    const messages = useMessages();
    if (!messages || typeof messages !== "object" || !("a11y" in messages)) {
      return (key: A11yKey) => enMessages.a11y[key] ?? key;
    }
    return useTranslations("a11y");
  } catch {
    return (key: A11yKey) => enMessages.a11y[key] ?? key;
  }
}
