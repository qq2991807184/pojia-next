import { useState } from "react";
import { AppShell } from "./layout/AppShell";
import { Dashboard } from "./pages/Dashboard";
import { PromptEditor } from "./pages/PromptEditor";
import { SimplePage } from "./pages/SimplePage";

export type PageKey = "home" | "clients" | "configs" | "prompt" | "backups" | "checks" | "settings";

export default function App() {
  const [page, setPage] = useState<PageKey>("home");
  const content = page === "home" ? <Dashboard onNavigate={setPage} />
    : page === "prompt" ? <PromptEditor />
    : <SimplePage page={page} />;
  return <AppShell page={page} onNavigate={setPage}>{content}</AppShell>;
}