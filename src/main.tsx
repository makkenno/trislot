import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { ActiveSkillsView } from "./components/features/active-skills-view";
import { BacklogView } from "./components/features/backlog-view";
import { HistoryView } from "./components/features/history-view";
import { AppShell } from "./components/layout/app-shell";
import { useSkillStore } from "./stores/skill-store";

function App() {
  const mode = useSkillStore((state) => state.mode);

  return (
    <AppShell>
      {mode === "active" && <ActiveSkillsView />}
      {mode === "backlog" && <BacklogView />}
      {mode === "history" && <HistoryView />}
    </AppShell>
  );
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
