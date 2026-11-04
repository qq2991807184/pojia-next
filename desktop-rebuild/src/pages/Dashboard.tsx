import { useEffect, useState } from "react";
import { ArrowRight, Boxes, FileCheck2, HardDrive, ScanSearch, Sparkles, Activity, AlertCircle } from "lucide-react";
import type { PageKey } from "../App";
import { apiGet, type BackendState } from "../lib/backend";

export function Dashboard({ onNavigate }: { onNavigate: (p: PageKey) => void }) {
  const [state,setState]=useState<BackendState|null>(null),[error,setError]=useState("");
  useEffect(()=>{let active=true;const load=async()=>{try{const data=await apiGet<BackendState>("/api/state");if(active){setState(data);setError("");}}catch(e){if(active)setError(String(e));}};void load();const t=window.setInterval(()=>void load(),3000);return()=>{active=false;window.clearInterval(t);};},[]);
  const count=state?.targets.filter(t=>t.detected).length;
  const configured=state?.targets.filter(t=>t.state==="patched").length;
  return <div className="dashboard">
    <div className="welcome-row"><div><div className="eyebrow">POJIA DESKTOP</div><h1>让配置管理，回归简单。</h1><p>本机 AI 客户端环境探针与配置批量管理。</p></div><div className="welcome-symbol">破</div></div>
    <div className="section-heading"><div><span className="eyebrow">OVERVIEW</span><h2>工作概况</h2></div><span className="muted">{state?.core_ready?"业务核心已连接": "等待业务核心连接"}</span></div>
    <div className="metric-grid">
      <Metric icon={<Boxes/>} label="已识别客户端" value={count===undefined?"—":String(count)} hint={state?"来自本机真实扫描":"等待业务服务接入"}/>
      <Metric icon={<FileCheck2/>} label="已完成配置" value={configured===undefined?"—":String(configured)} hint="按核心返回状态统计"/>
      <Metric icon={<HardDrive/>} label="当前任务" value={state?.busy?"执行中":"—"} hint={state?.busy?state.busy_label||"业务任务运行中":"暂无运行任务"}/>
    </div>
    {error&&<div className="backend-error dashboard-error"><AlertCircle size={15}/>{error}</div>}
    <div className="section-heading"><div><span className="eyebrow">QUICK ACCESS</span><h2>快捷入口</h2></div></div>
    <div className="quick-grid">
      <Quick icon={<ScanSearch/>} title="扫描客户端" desc="识别本机已安装的 AI 编程工具" onClick={() => onNavigate("clients")}/>
      <Quick icon={<Activity/>} title="检测运行环境" desc="检查运行依赖与可补全项目" onClick={() => onNavigate("env")}/>
      <Quick icon={<Sparkles/>} title="人格编辑" desc="直接编辑核心当前使用的人格文件" onClick={() => onNavigate("persona")}/>
    </div>
    <div className="notice"><div className="notice-icon"><Sparkles size={17}/></div><div><strong>{state?.core_ready?"已连接原版业务核心":"桌面界面与业务核心尚未连通"}</strong><p>{state?.core_ready?"客户端状态和执行进度来自原版核心接口，写入与还原仍走原有 run_action 执行链。":"当前界面已具备本地 API 桥接；需启动原版破甲后台后读取真实状态。自动打包启动仍在接入中。"}</p></div><ArrowRight size={16}/></div>
  </div>;
}
function Metric({icon,label,value,hint}:{icon:React.ReactNode;label:string;value:string;hint:string}) { return <div className="metric-card"><div className="metric-top">{icon}<span>{label}</span></div><strong>{value}</strong><small>{hint}</small></div>; }
function Quick({icon,title,desc,onClick}:{icon:React.ReactNode;title:string;desc:string;onClick:()=>void}) { return <button className="quick-card" onClick={onClick}><span className="quick-icon">{icon}</span><strong>{title}</strong><p>{desc}</p><ArrowRight size={16}/></button>; }
