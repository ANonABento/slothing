import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { injectSharedCss } from "@/shared/ui/tokens";
import "./styles.css";

// Shared editorial tokens + component vocabulary, prepended so the surface
// stylesheet (linked after) still wins on equal-specificity ties.
injectSharedCss();

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
