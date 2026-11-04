import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Download, RefreshCw, LoaderCircle, Terminal } from "lucide-react";
import { apiGet, apiPost } from "../lib/backend";
type EnvItem={key:string;label:string;state:"ok"|"missing"|"warn";detail:string;installable:boolean};
type EnvState={items:EnvItem[];scanning:boolean;busy:boolean;busy_label:string;busy_key:string};
export function EnvironmentPage(){
 const [data,setData]=useState<EnvState|null>(null),[error,setError]=useState(""),[selected,setSelected]=useState<string[]>([]),[busy,setBusy]=useState(false);
 const refresh=useCallback(async()=>{try{setData(await apiGet<EnvState>("/api/env"));setError("");}catch(e){setError(String(e));}},[]);
 useEffect(()=>{void refresh();const t=window.setInterval(()=>void refresh(),1800);return()=>window.clearInterval(t);},[refresh]);
 const scan=async()=>{try{await apiPost("/api/env/scan");await refresh();}catch(e){setError(String(e));}};
 const install=async()=>{if(!selected.length)return;setBusy(true);setError("");try{const r=await apiPost<{ok:boolean;err?:string}>("/api/env/install",{keys:selected});if(!r.ok)setError(r.err||"环境补全未启动");setSelected([]);await refresh();}catch(e){setError(String(e));}finally{setBusy(false);}};
 return <div className="content-page"><div className="page-heading"><div><span className="eyebrow">RUNTIME REQUIREMENTS</span><h1>环境检测</h1><p>查看破甲运行所需环境，并按需补全缺失依赖。</p></div><button className="button-quiet" onClick={()=>void scan()} disabled={!data||data.scanning||data.busy}><RefreshCw size={14}/> 重新检测</button></div>
 {error&&<div className="backend-error"><AlertCircle size={16}/>{error}</div>}
 <div className="env-status"><span className={data?.scanning?"pulse-dot":"status-dot"}/>{!data?"正在连接环境服务…":data.scanning?"正在检测环境…":data.busy?data.busy_label||"正在补全环境":"检测已完成"}</div>
 <div className="env-list">{(data?.items||[]).map(item=><label className="env-row" key={item.key}><div className={"env-state "+item.state}>{item.state==="ok"?<CheckCircle2 size={17}/>:item.state==="missing"?<AlertCircle size={17}/>:<AlertCircle size={17}/>}</div><div className="env-copy"><strong>{item.label}</strong><p>{item.detail||"等待检测结果"}</p></div><span className={"env-badge "+item.state}>{item.state==="ok"?"正常":item.state==="missing"?"缺失":"需注意"}</span>{item.state==="missing"&&item.installable&&<input type="checkbox" checked={selected.includes(item.key)} onChange={e=>setSelected(s=>e.target.checked?[...s,item.key]:s.filter(k=>k!==item.key))}/>}</label>)}</div>
 <div className="env-actions"><span>仅对支持自动补全的项目显示选择框</span><button className="button-primary" disabled={!selected.length||busy||Boolean(data?.busy)} onClick={()=>void install()}><Download size={14}/>{busy||data?.busy?"处理中":`补全所选环境（${selected.length}）`}</button></div>
 </div>;
}