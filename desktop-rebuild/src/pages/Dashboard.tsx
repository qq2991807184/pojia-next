import { ArrowRight, Boxes, FileCheck2, HardDrive, ScanSearch, Sparkles } from "lucide-react";
import type { PageKey } from "../App";

export function Dashboard({ onNavigate }: { onNavigate: (p: PageKey) => void }) {
  return <div className="dashboard">
    <div className="welcome-row"><div><div className="eyebrow">POJIA DESKTOP</div><h1>让配置管理，回归简单。</h1><p>统一查看 AI 客户端、配置方案与本地变更状态。</p></div><div className="welcome-symbol">破</div></div>
    <div className="section-heading"><div><span className="eyebrow">OVERVIEW</span><h2>工作概况</h2></div><span className="muted">实际数据接入后显示实时状态</span></div>
    <div className="metric-grid">
      <Metric icon={<Boxes/>} label="已识别客户端" value="—" hint="等待扫描接入"/>
      <Metric icon={<FileCheck2/>} label="配置方案" value="—" hint="等待配置模块接入"/>
      <Metric icon={<HardDrive/>} label="本地备份" value="—" hint="等待备份模块接入"/>
    </div>
    <div className="section-heading"><div><span className="eyebrow">QUICK ACCESS</span><h2>快捷入口</h2></div></div>
    <div className="quick-grid">
      <Quick icon={<ScanSearch/>} title="扫描客户端" desc="识别本机已安装的 AI 编程工具" onClick={() => onNavigate("clients")}/>
      <Quick icon={<FileCheck2/>} title="管理配置方案" desc="查看配置、规则与变更预览" onClick={() => onNavigate("configs")}/>
      <Quick icon={<Sparkles/>} title="编辑提示词" desc="从空白开始，内容由你自己填写" onClick={() => onNavigate("prompt")}/>
    </div>
    <div className="notice"><div className="notice-icon"><Sparkles size={17}/></div><div><strong>先搭好框架，再接入真实能力</strong><p>当前页面不展示虚构扫描结果。客户端识别、配置读写与备份恢复将在后续接入原有业务模块。</p></div><ArrowRight size={16}/></div>
  </div>;
}
function Metric({icon,label,value,hint}:{icon:React.ReactNode;label:string;value:string;hint:string}) { return <div className="metric-card"><div className="metric-top">{icon}<span>{label}</span></div><strong>{value}</strong><small>{hint}</small></div>; }
function Quick({icon,title,desc,onClick}:{icon:React.ReactNode;title:string;desc:string;onClick:()=>void}) { return <button className="quick-card" onClick={onClick}><span className="quick-icon">{icon}</span><strong>{title}</strong><p>{desc}</p><ArrowRight size={16}/></button>; }