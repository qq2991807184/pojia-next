import { useState } from "react";
import { Save, FilePlus2, RotateCcw } from "lucide-react";

const STORAGE_KEY = "pojia.prompt.content";

export function PromptEditor() {
  const [value, setValue] = useState(() => localStorage.getItem(STORAGE_KEY) ?? "");
  const [saved, setSaved] = useState(() => localStorage.getItem(STORAGE_KEY) ?? "");
  const dirty = value !== saved;
  return <div className="content-page">
    <div className="page-heading"><div><span className="eyebrow">PERSONAL WORKSPACE</span><h1>提示词编辑</h1><p>编辑区保持空白。不会自动写入模板、预设或任何提示词正文。</p></div><span className="tag-neutral">空白起始</span></div>
    <section className="editor-panel">
      <div className="editor-toolbar"><div><strong>提示词内容</strong><span>纯文本 · 本地编辑区</span></div><div className="editor-actions"><button className="button-quiet" onClick={() => setValue("")}><FilePlus2 size={15}/>清空</button><button className="button-primary" onClick={() => {localStorage.setItem(STORAGE_KEY, value); setSaved(value);}}><Save size={15}/>保存内容</button></div></div>
      <textarea className="prompt-textarea" value={value} onChange={e => setValue(e.target.value)} placeholder="" spellCheck={false}/>
      <div className="editor-footer"><span>{value.length} 个字符</span><span>{dirty ? "有未保存的修改" : value.length === 0 ? "内容为空" : "已保存"}</span></div>
    </section>
    <div className="editor-footnote"><RotateCcw size={14}/> 当前编辑内容保存在本机浏览器存储；后续将迁移至 Rust 本地配置服务。</div>
  </div>;
}