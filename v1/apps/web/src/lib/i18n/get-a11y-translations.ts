import enMessages from "@/messages/en.json";

type A11yKey = keyof typeof enMessages.a11y;
type A11yTranslator = (key: A11yKey) => string;

const fallbackA11yT: A11yTranslator = (key) => enMessages.a11y[key] ?? key;

export async function getA11yTranslations(): Promise<A11yTranslator> {
  try {
    const serverIntl = await import("next-intl/server");
    if (typeof serverIntl.getTranslations !== "function") {
      return fallbackA11yT;
    }
    return (await serverIntl.getTranslations("a11y")) as A11yTranslator;
  } catch {
    return fallbackA11yT;
  }
}
