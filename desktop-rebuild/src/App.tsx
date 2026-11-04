import { useState } from "react";
import { AppShell } from "./layout/AppShell";
import { Dashboard } from "./pages/Dashboard";
import { PromptEditor } from "./pages/PromptEditor";
import { SimplePage } from "./pages/SimplePage";
import { ClientsPage } from "./pages/ClientsPage";
import { EnvironmentPage } from "./pages/EnvironmentPage";
import { PersonaPage } from "./pages/PersonaPage";
import { ConfigsPage } from "./pages/ConfigsPage";
import { ChecksPage } from "./pages/ChecksPage";
import { SkillsPage } from "./pages/SkillsPage";
import { LogsPage } from "./pages/LogsPage";

export type PageKey = "home" | "clients" | "configs" | "env" | "persona" | "skills" | "logs" | "prompt" | "backups" | "checks" | "settings";

export default function App() {
  const [page, setPage] = useState<PageKey>("home");
  const content = page === "home" ? <Dashboard onNavigate={setPage} />
    : page === "clients" ? <ClientsPage />
    : page === "configs" ? <ConfigsPage />
    : page === "checks" ? <ChecksPage />
    : page === "skills" ? <SkillsPage />
    : page === "logs" ? <LogsPage />
    : page === "env" ? <EnvironmentPage />
    : page === "persona" ? <PersonaPage />
    : page === "prompt" ? <PromptEditor />
    : <SimplePage page={page} />;
  return <AppShell page={page} onNavigate={setPage}>{content}</AppShell>;
}