import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { isTauri } from "@tauri-apps/api/core";
import { load } from "@tauri-apps/plugin-store";
import { Activity, Archive, CheckCircle2, ChevronLeft, ChevronRight, FileSliders, Home, Puzzle, Settings2, ShieldCheck, Sparkles, Cpu, UserRound, Cloud, Puzzle } from "lucide-react";
import type { PageKey } from "../App";
import { TitleBar } from "./TitleBar";

const nav: { id: PageKey; label: string; icon: typeof Home; group: string }[] = [
  { id: "home", label: "总览", icon: Home, group: "工作区" },
  { id: "clients", label: "客户端", icon: Puzzle, group: "工作区" },
  { id: "configs", label: "配置方案", icon: FileSliders, group: "工作区" },
  { id: "env", label: "环境检测", icon: Cpu, group: "工作区" },
  { id: "persona", label: "人格编辑", icon: UserRound, group: "工作区" },
  { id: "skills", label: "技能市场", icon: Puzzle, group: "工作区" },
  { id: "cloud", label: "云端验证", icon: Cloud, group: "应用" },
  { id: "prompt", label: "提示词", icon: Sparkles, group: "工作区" },
  { id: "backups", label: "备份中心", icon: Archive, group: "维护" },
  { id: "checks", label: "生效检查", icon: ShieldCheck, group: "维护" },
  { id: "settings", label: "设置", icon: Settings2, group: "应用" }
];

const SIDEBAR_KEY = "sidebar.collapsed";
const LEGACY_SIDEBAR_KEY = "pojia.sidebar.collapsed";

async function readCollapsed(): Promise<boolean> {
  if (isTauri()) {
    const store = await load("settings.json", { autoSave: true });
    const saved = await store.get<boolean>(SIDEBAR_KEY);
    if (saved !== null && saved !== undefined) return saved;
    const legacy = localStorage.getItem(LEGACY_SIDEBAR_KEY) === "1";
    await store.set(SIDEBAR_KEY, legacy);
    await store.save();
    return legacy;
  }
  return localStorage.getItem(LEGACY_SIDEBAR_KEY) === "1";
}

async function writeCollapsed(value: boolean): Promise<void> {
  if (isTauri()) {
    const store = await load("settings.json", { autoSave: true });
    await store.set(SIDEBAR_KEY, value);
    await store.save();
    return;
  }
  localStorage.setItem(LEGACY_SIDEBAR_KEY, value ? "1" : "0");
}

export function AppShell({ page, onNavigate, children }: { page: PageKey; onNavigate: (p: PageKey) => void; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    readCollapsed().then(value => { if (active) setCollapsed(value); })
      .catch(() => { if (active) setCollapsed(false); });
    return () => { active = false; };
  }, []);
  const toggleCollapsed = async () => {
    const next = !(collapsed ?? false);
    setCollapsed(next);
    try { await writeCollapsed(next); } catch { /* Keep current session responsive if disk persistence fails. */ }
  };
  const isCollapsed = collapsed === true;
  const title = nav.find(n => n.id === page)?.label ?? "总览";
  return <div className="app-frame">
    <aside className={`sidebar ${isCollapsed ? "is-collapsed" : ""} ${collapsed === null ? "is-loading" : ""}`}>
      <div className="brand-zone">
        <div className="brand-mark">破</div>
        {!isCollapsed && <div className="brand-copy"><strong>破甲</strong><span>让强大的 AI 成就更强大的你</span></div>}
        <button className="collapse-btn" title={isCollapsed ? "展开侧栏" : "收起侧栏"} onClick={toggleCollapsed} disabled={collapsed === null}>
          {isCollapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
        </button>
      </div>
      <div className="sidebar-rule" />
      {!isCollapsed && <div className="nav-caption">导航</div>}
      <nav className="nav-list">
        {nav.map(item => {
          const Icon = item.icon;
          return <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} title={isCollapsed ? item.label : undefined} onClick={() => onNavigate(item.id)}>
            <Icon size={18}/>{!isCollapsed && <span>{item.label}</span>}{!isCollapsed && page === item.id && <i/>}
          </button>;
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="status-indicator"><span className="status-dot"/>{!isCollapsed && <span>本地运行环境</span>}</div>
        {!isCollapsed && <div className="slogan">伟大无需多言</div>}
      </div>
    </aside>
    <section className="main-column">
      <TitleBar title={title}/>
      <main className="page-area">{children}</main>
      <footer className="statusbar"><span><Activity size={13}/> 破甲桌面端 · 框架构建中</span><span>本地优先 <CheckCircle2 size={13}/></span></footer>
    </section>
  </div>;
}
