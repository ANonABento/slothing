/** "Today", "Yesterday", "12 days ago". */
export function ago(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return days <= 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`;
}

/** "greenhouse.io" from a page link; "" when there's no link. */
export function hostOf(url: string) {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, "") : "";
  } catch {
    return "";
  }
}

/** An endpoint on this machine (Ollama, LM Studio), which needs no API key. `host.docker.internal` is the host, seen from Docker. */
export function isLocalEndpoint(url: string) {
  try {
    const host = new URL(url).hostname;
    return ["localhost", "127.0.0.1", "[::1]", "host.docker.internal"].includes(host) || host.endsWith(".localhost");
  } catch {
    return false;
  }
}
