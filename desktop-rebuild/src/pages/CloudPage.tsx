import {useEffect,useState} from "react";
import {apiGet,apiPost} from "../lib/backend";
import {Cloud,LockKeyhole,RefreshCw,AlertCircle,CheckCircle2} from "lucide-react";
type CloudState={mode:string;state:string;msg:string;group_saved:boolean;gate:boolean;saved_code:string};
export function CloudPage(){const [s,setS]=useState<CloudState|null>(null),[group,setGroup]=useState(""),[code,setCode]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState("");
useEffect(()=>{let active=true;const load=async()=>{try{const v=await apiGet<CloudState>("/api/cloud/state");if(active){setS(v);if(v.group_saved)setGroup(g=>g||"");if(v.saved_code)setCode(c=>c||v.saved_code);}}catch(e){if(active)setError(String(e));}};void load();const t=window.setInterval(()=>void load(),500);return()=>{active=false;window.clearInterval(t);};},[]);
const verify=async()=>{setBusy(true);setError("");try{const r=await apiPost<{ok:boolean;err?:string;msg?:string}>("/api/cloud/verify",{group,code});if(!r.ok)setError(r.msg||r.err||"验证未启动");}catch(e){setError(String(e));}finally{setBusy(false);}};
return <div className="content-page"><div className="page-heading"><div><span className="eyebrow">CLOUD AUTHENTICATION</span><h1>云端验证</h1><p>沿用原版核心验证状态与提交协议，不在新界面重复实现验证算法。</p></div><span className="tag-neutral">{s?.mode==="local"?"本地核心":"云端模式"}</span></div>
{error&&<div className="backend-error"><AlertCircle size={15}/>{error}</div>}
<div className="cloud-panel"><div className="cloud-icon"><Cloud size={23}/></div><strong>{s?.mode==="local"?"当前为本地核心模式":s?.state==="ok"?"验证通过":s?.state==="fail"?"验证失败":s?.state==="verifying"?"正在验证":s?.state==="wait_group"?"等待群号":"正在读取验证状态"}</strong><p>{s?.mode==="local"?"本地核心无需云端验证。":s?.msg||"验证状态由原版核心提供。"}</p>
{s?.mode==="cloud"&&<div className="cloud-form"><label>官方交流群号<input value={group} onChange={e=>setGroup(e.target.value)} placeholder="输入交流群号"/></label>{s.gate&&<label>激活码<input value={code} onChange={e=>setCode(e.target.value)} placeholder="PJ-XXXX-XXXX-XXXX"/></label>}<button className="button-primary" onClick={()=>void verify()} disabled={busy||!group.trim()||s.state==="verifying"}><LockKeyhole size={14}/>{busy?"提交中":"提交验证"}</button></div>}
</div></div>}