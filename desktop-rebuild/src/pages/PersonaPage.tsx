import {useEffect,useState} from "react";
import {apiGet,apiPost} from "../lib/backend";
import {Save,RotateCcw,AlertCircle} from "lucide-react";
type Persona={text:string;path:string};
export function PersonaPage(){
 const [text,setText]=useState(""),[saved,setSaved]=useState(""),[path,setPath]=useState(""),[loaded,setLoaded]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(""),[note,setNote]=useState("");
 const loadPersona=async()=>{setError("");try{const p=await apiGet<Persona>("/api/persona");setText(p.text||"");setSaved(p.text||"");setPath(p.path||"");}catch(e){setError(String(e));}finally{setLoaded(true);}};
 useEffect(()=>{void loadPersona();},[]);
 const save=async()=>{setBusy(true);setError("");setNote("");try{const r=await apiPost<{ok:boolean;err?:string}>("/api/persona",{text});if(!r.ok)throw new Error(r.err||"保存失败");setSaved(text);setNote("人格内容已保存到原版业务核心指定路径。");}catch(e){setError(String(e));}finally{setBusy(false);}};
 const reset=async()=>{if(!window.confirm("确定将人格恢复为核心内置默认内容？当前编辑内容会被替换。"))return;setBusy(true);setError("");try{const r=await apiPost<{ok:boolean;text?:string;err?:string}>("/api/persona/reset",{});if(!r.ok)throw new Error(r.err||"重置失败");setText(r.text||"");setSaved(r.text||"");setNote("已恢复为核心默认人格。");}catch(e){setError(String(e));}finally{setBusy(false);}};
 return <div className="content-page"><div className="page-heading"><div><span className="eyebrow">AI PERSONA</span><h1>人格编辑</h1><p>读取并修改原版核心正在使用的人格文件。</p></div><span className="tag-neutral">核心文件</span></div>
 {error&&<div className="backend-error"><AlertCircle size={16}/>{error}</div>}
 <section className="editor-panel"><div className="editor-toolbar"><div><strong>人格正文</strong><span>{path||"等待读取文件位置"}</span></div><div className="editor-actions"><button className="button-quiet" disabled={!loaded||busy} onClick={()=>void reset()}><RotateCcw size={14}/>恢复默认</button><button className="button-primary" disabled={!loaded||busy||text===saved||!text.trim()} onClick={()=>void save()}><Save size={14}/>{busy?"处理中":"保存人格"}</button></div></div>
 <textarea className="prompt-textarea persona-textarea" value={text} onChange={e=>setText(e.target.value)} disabled={!loaded||busy} placeholder={loaded?"人格文件为空":"正在读取核心人格…"}/>
 <div className="editor-footer"><span>{text.length} 个字符</span><span>{!loaded?"读取中":text!==saved?"有未保存修改":"已与核心文件同步"}</span></div></section>
 {note&&<div className="backend-message"><span>{note}</span></div>}
 </div>;
}