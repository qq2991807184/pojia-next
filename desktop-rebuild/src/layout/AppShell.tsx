import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Activity, Archive, ArrowUpRight, Boxes, CheckCircle2, ChevronLeft, ChevronRight, Command, FileSliders, Home, Puzzle, Settings2, ShieldCheck, Sparkles } from "lucide-react";
import type { PageKey } from "../App";
import { TitleBar } from "./TitleBar";

const nav: { id: PageKey; label: string; icon: typeof Home; group: string }[] = [
  { id: "home", label: "总览", icon: Home, group: "工作区" },
  { id: "clients", label: "客户端", icon: Puzzle, group: "工作区" },
  { id: "configs", label: "配置方案", icon: FileSliders, group: "工作区" },
  { id: "prompt", label: "提示词", icon: Sparkles, group: "工作区" },
  { id: "backups", label: "备份中心", icon: Archive, group: "维护" },
  { id: "checks", label: "生效检查", icon: ShieldCheck, group: "维护" },
  { id: "settings", label: "设置", icon: Settings2, group: "应用" }
];

export function AppShell({ page, onNavigate, children }: { page: PageKey; onNavigate: (p: PageKey) => void; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("pojia.sidebar.collapsed") === "1");
  useEffect(() => { localStorage.setItem("pojia.sidebar.collapsed", collapsed ? "1" : "0"); }, [collapsed]);
  const title = nav.find(n => n.id === page)?.label ?? "总览";
  return <div className="app-frame">
    <aside className={`sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="brand-zone">
        <div className="brand-mark">破</div>
        {!collapsed && <div className="brand-copy"><strong>破甲</strong><span>让强大的 AI 成就更强大的你</span></div>}
        <button className="collapse-btn" title={collapsed ? "展开侧栏" : "收起侧栏"} onClick={() => setCollapsed(v => !v)}>
          {collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
        </button>
      </div>
      <div className="sidebar-rule" />
      {!collapsed && <div className="nav-caption">导航</div>}
      <nav className="nav-list">
        {nav.map(item => {
          const Icon = item.icon;
          return <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} title={collapsed ? item.label : undefined} onClick={() => onNavigate(item.id)}>
            <Icon size={18}/>{!collapsed && <span>{item.label}</span>}{!collapsed && page === item.id && <i/>}
          </button>;
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="status-indicator"><span className="status-dot"/>{!collapsed && <span>本地运行环境</span>}</div>
        {!collapsed && <div className="slogan">伟大无需多言</div>}
      </div>
    </aside>
    <section className="main-column">
      <TitleBar title={title}/>
      <main className="page-area">{children}</main>
      <footer className="statusbar"><span><Activity size={13}/> 破甲桌面端 · 框架构建中</span><span>本地优先 <CheckCircle2 size={13}/></span></footer>
    </section>
  </div>;
}