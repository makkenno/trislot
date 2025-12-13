import type { ReactNode } from "react";
import { useSkillStore } from "../../stores/skill-store";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { mode, setMode } = useSkillStore();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border p-4 bg-card">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="Trislot" className="w-8 h-8" />
            <h1 className="text-xl font-bold">Trislot</h1>
          </div>
          <nav className="flex bg-muted p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setMode("active")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                mode === "active"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              習得中
            </button>
            <button
              type="button"
              onClick={() => setMode("backlog")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                mode === "backlog"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              やりたいこと
            </button>
            <button
              type="button"
              onClick={() => setMode("history")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                mode === "history"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              習得済み
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
}
