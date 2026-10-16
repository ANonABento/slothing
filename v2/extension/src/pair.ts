/* ─── Runs on Slothing's own pages (localhost) ───
 * Lets the Extension page connect the extension in one click: the page posts its address and key,
 * and this saves them. Only pages that are Slothing (the slothing-app meta tag) are listened to.
 */

if (document.querySelector('meta[name="slothing-app"]')) {
  const hello = async () => {
    const { connection } = (await chrome.storage.local.get("connection")) as { connection?: { server: string } };
    window.postMessage({ type: "slothing:extension", version: __VERSION__, connectedTo: connection?.server ?? null }, location.origin);
  };
  window.addEventListener("message", async (e) => {
    if (e.source !== window || e.origin !== location.origin) return;
    if (e.data?.type === "slothing:ping") return hello();
    if (e.data?.type === "slothing:connect" && typeof e.data.key === "string") {
      await chrome.storage.local.set({ connection: { server: location.origin, key: e.data.key } });
      await hello();
    }
  });
  void hello();
}
