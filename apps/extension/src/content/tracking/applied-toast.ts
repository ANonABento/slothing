export function showAppliedToast(company: string, onClick: () => void): void {
  document.querySelector(".columbus-toast-applied")?.remove();

  const toast = document.createElement("div");
  toast.className = "columbus-toast columbus-toast-applied";
  toast.tabIndex = 0;
  toast.setAttribute("role", "button");
  toast.setAttribute("aria-label", "Open Slothing dashboard");
  toast.textContent = `✓ Tracked in Slothing - applied to ${company}`;

  const dismiss = () => toast.remove();
  const timeoutId = window.setTimeout(dismiss, 6000);

  toast.addEventListener("click", () => {
    window.clearTimeout(timeoutId);
    onClick();
    dismiss();
  });
  toast.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toast.click();
      return;
    }
    if (event.key === "Escape") {
      window.clearTimeout(timeoutId);
      dismiss();
    }
  });

  document.body.appendChild(toast);
}
