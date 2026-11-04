import {useEffect,useState} from "react";
import {apiGet,apiPost} from "../lib/backend";
import {Puzzle,Download,CheckCircle2,AlertCircle} from "lucide-react";
type Skill={name:string;cat?:string;use?:string;how?:string;installed?:boolean;path?:string;src?:string;desc?:string};
type Skills={recommended:Skill[];installed:Skill[];market:Skill[]};
export function SkillsPage(){const [s,setS]=useState<Skills|null>(null),[error,setError]=useState(""),[busy,setBusy]=useState("");
const load=async()=>{try{setS(await apiGet<Skills>("/api/skills"));setError("");}catch(e){setError(String(e));}};
useEffect(()=>{void load();},[]);
const install=async(src:string)=>{setBusy(src);setError("");try{const r=await apiPost<{ok:boolean;err?:string}>("/api/skill/install",{src});if(!r.ok)throw new Error(r.err||"安装失败");await load();}catch(e){setError(String(e));}finally{setBusy("");}};
return <div className="content-page"><div className="page-heading"><div><span className="eyebrow">SKILL MARKET</span><h1>技能市场</h1><p>读取原版核心的推荐技能、已安装技能与可用市场条目。</p></div><span className="tag-neutral">{s?.installed.length??"—"} 已安装</span></div>{error&&<div className="backend-error"><AlertCircle size={15}/>{error}</div>}
<section className="skill-section"><h2>已安装</h2>{(s?.installed||[]).map((x,i)=><div className="skill-row" key={i}><CheckCircle2 size={16}/><div><strong>{x.name}</strong><small>{x.path}</small></div><span>已安装</span></div>)}{s?.installed.length===0&&<p className="muted">尚未检测到已安装技能。</p>}</section>
<section className="skill-section"><h2>推荐技能</h2><div className="skill-grid">{(s?.recommended||[]).map((x,i)=><article className="skill-card" key={i}><div><span>{x.cat||"推荐"}</span>{x.installed&&<CheckCircle2 size={14}/>}</div><strong>{x.name}</strong><p>{x.use||x.how||"由原版技能目录提供。"}</p></article>)}</div></section>
<section className="skill-section"><h2>市场条目</h2>{(s?.market||[]).map((x,i)=><div className="skill-row" key={i}><Puzzle size={16}/><div><strong>{x.name}</strong><small>{x.desc}</small></div><button className="button-quiet" disabled={!x.src||Boolean(busy)} onClick={()=>void install(x.src!)}><Download size={13}/>{busy===x.src?"安装中":"安装"}</button></div>)}</section>
</div>}