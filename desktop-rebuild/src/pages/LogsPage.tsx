import {useEffect,useState} from "react";
import {apiGet,apiPost} from "../lib/backend";
import {Terminal,Trash2,AlertCircle} from "lucide-react";
type LogData={lines:[number,string][];next:number};
const strip=(s:string)=>s.replace(/\u001b\[[0-9;]*m/g,"");
export function LogsPage(){const [lines,setLines]=useState<string[]>([]),[cursor,setCursor]=useState(0),[error,setError]=useState("");
useEffect(()=>{let active=true;const poll=async()=>{try{const r=await apiGet<LogData>("/api/log?after="+cursor);if(!active)return;if(r.lines?.length){setLines(old=>[...old,...r.lines.map(x=>strip(x[1]))].slice(-1000));setCursor(r.next);}setError("");}catch(e){if(active)setError(String(e));}};void poll();const t=window.setInterval(()=>void poll(),900);return()=>{active=false;window.clearInterval(t);};},[cursor]);
const clear=async()=>{try{await apiPost("/api/log/clear",{});setLines([]);setCursor(0);}catch(e){setError(String(e));}};
return <div className="content-page"><div className="page-heading"><div><span className="eyebrow">RUNTIME OUTPUT</span><h1>运行日志</h1><p>实时查看原版核心的扫描、执行、备份与错误输出。</p></div><button className="button-quiet" onClick={()=>void clear()}><Trash2 size={14}/> 清空显示</button></div>{error&&<div className="backend-error"><AlertCircle size={15}/>{error}</div>}<section className="live-log full-log"><div className="log-heading"><div><Terminal size={15}/><strong>核心输出流</strong></div><span>{lines.length} 条 · 增量轮询</span></div><div className="log-lines">{lines.length?lines.map((line,i)=><div key={i}>{line}</div>):<span className="log-placeholder">等待核心输出…</span>}</div></section></div>;}