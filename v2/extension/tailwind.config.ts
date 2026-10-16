import base from "../tailwind.config";

// The app's tokens and scale, scanning the popup and the shared components it uses.
export default { ...base, content: ["./extension/src/**/*.{ts,tsx}", "./src/components/ui.tsx", "./src/components/dropdown.tsx"] };
