import { useEffect, useState } from "react";
import { Save, FilePlus2, RotateCcw } from "lucide-react";
import { isTauri } from "@tauri-apps/api/core";
import { load } from "@tauri-apps/plugin-store";

const STORAGE_KEY = "prompt.content";
const FALLBACK_KEY = "pojia.prompt.content";

async function readPrompt(): Promise<string> {
  if (isTauri()) {
    const store = await load("settings.json", { autoSave: true });
    return (await store.get<string>(STORAGE_KEY)) ?? "";
  }
  return localStorage.getItem(FALLBACK_KEY) ?? "";
}

async function writePrompt(value: string): Promise<void> {
  if (isTauri()) {
    const store = await load("settings.json", { autoSave: true });
    await store.set(STORAGE_KEY, value);
    await store.save();
    return;
  }
  localStorage.setItem(FALLBACK_KEY, value);
}

export function PromptEditor() {
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    readPrompt().then((text) => {
      if (!active) return;
      setValue(text);
      setSaved(text);
      setLoaded(true);
    }).catch(() => {
      if (active) {
        setError("读取本地内容失败，请检查应用数据目录权限。");
        setLoaded(true);
      }
    });
    return () => { active = false; };
  }, []);

  const dirty = value !== saved;
  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await writePrompt(value);
      setSaved(value);
    } catch {
      setError("保存失败，原有内容未被标记为已保存。");
    } finally {
      setSaving(false);
    }
  };

  return <div className="content-page">
    <div className="page-heading"><div><span className="eyebrow">PERSONAL WORKSPACE</span><h1>提示词编辑</h1><p>编辑区保持空白。不会自动写入模板、预设或任何提示词正文。</p></div><span className="tag-neutral">空白起始</span></div>
    <section className="editor-panel">
      <div className="editor-toolbar"><div><strong>提示词内容</strong><span>纯文本 · 本地持久化</span></div><div className="editor-actions"><button className="button-quiet" onClick={() => setValue("")}><FilePlus2 size={15}/>清空</button><button className="button-primary" disabled={!loaded || saving || !dirty} onClick={save}><Save size={15}/>{saving ? "保存中" : "保存内容"}</button></div></div>
      <textarea className="prompt-textarea" value={value} onChange={e => setValue(e.target.value)} placeholder="" spellCheck={false} disabled={!loaded}/>
      <div className="editor-footer"><span>{value.length} 个字符</span><span>{!loaded ? "正在读取本地内容" : dirty ? "有未保存的修改" : value.length === 0 ? "内容为空" : "已保存"}</span></div>
    </section>
    {error && <div className="editor-error">{error}</div>}
    <div className="editor-footnote"><RotateCcw size={14}/> 桌面应用使用 Tauri 本地文件存储；浏览器预览使用浏览器本地存储。</div>
  </div>;
}
