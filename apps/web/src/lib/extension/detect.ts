export const EXTENSION_CONNECTED_STORAGE_KEY = "columbus_extension_token";
export const EXTENSION_ID = process.env.NEXT_PUBLIC_COLUMBUS_EXTENSION_ID ?? "";

type ChromeRuntimeGlobal = {
  chrome?: {
    runtime?: {
      sendMessage?: (
        extensionId: string,
        message: unknown,
        responseCallback: (response: unknown) => void,
      ) => void;
    };
  };
};

export function hasExtensionConnectionToken(storage?: Storage | null): boolean {
  try {
    return Boolean(storage?.getItem(EXTENSION_CONNECTED_STORAGE_KEY));
  } catch {
    return false;
  }
}

function getClientStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export async function isExtensionInstalled(): Promise<boolean> {
  if (hasExtensionConnectionToken(getClientStorage())) {
    return true;
  }

  const chromeGlobal = (globalThis as unknown as ChromeRuntimeGlobal).chrome;
  const sendMessage = chromeGlobal?.runtime?.sendMessage;

  if (!EXTENSION_ID || !sendMessage) {
    return false;
  }

  return new Promise((resolve) => {
    let settled = false;
    const timeout = window.setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(false);
      }
    }, 500);

    try {
      sendMessage(EXTENSION_ID, { type: "PING" }, (response: unknown) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        resolve(Boolean(response));
      });
    } catch {
      if (!settled) {
        settled = true;
        window.clearTimeout(timeout);
        resolve(false);
      }
    }
  });
}
