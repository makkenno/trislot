import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <h1 className="text-4xl font-bold">Trislot Initialized</h1>
    </div>
  </StrictMode>,
);
