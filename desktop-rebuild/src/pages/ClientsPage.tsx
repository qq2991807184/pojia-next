import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, AlertCircle, CheckCircle2, Circle, LoaderCircle, Play, RefreshCw, RotateCcw, ShieldCheck, Square, Terminal } from "lucide-react";
import { apiGet, apiPost, type BackendState, type Target } from "../lib/backend";

const primaryKeys = new Set(["dsh", "wb", "zcode"]);
type LogResponse = { lines: [number, string][]; next: number };
const cleanLog = (value: string) => value.replace(/\u001b\[[0-9;]*m/g, "");

export function ClientsPage() {
  const [snapshot, setSnapshot] = useState<BackendState | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [logCursor, setLogCursor] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const refresh = useCallback(async (fresh = false) => {
    try {
      const next = await apiGet<BackendState>(fresh ? "/api/state?fresh=1" : "/api/state");
      setSnapshot(next);
      setError("");
      setSelected(current => current.length ? current.filter(key => next.targets.some(t => t.key === key && t.detected)) : next.targets.filter(t => t.detected).map(t => t.key));
    } catch (e) { setError(String(e)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 2500);
    return () => window.clearInterval(timer);
  }, [refresh]);

  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const result = await apiGet<LogResponse>("/api/log?after=" + logCursor);
        if (!active) return;
        if (result.lines?.length) {
          setLogs(current => [...current, ...result.lines.map(line => cleanLog(line[1]))].slice(-250));
          setLogCursor(result.next);
        }
      } catch { /* The main state panel reports backend connection failures. */ }
    };
    void poll();
    const timer = window.setInterval(() => void poll(), 1000);
    return () => { active = false; window.clearInterval(timer); };
  }, [logCursor]);

  const detected = useMemo(() => snapshot?.targets.filter(t => t.detected).length ?? 0, [snapshot]);
  const toggle = (key: string) => setSelected(current => current.includes(key) ? current.filter(k => k !== key) : [...current, key]);

  const runAction = async (action: string) => {
    if (!selected.length || working) return;
    setWorking(true); setMessage(""); setError("");
    try {
      const result = await apiPost<{ok:boolean;err?:string;mode?:string}>("/api/action", { action, targets: selected });
      if (!result.ok) setError(result.err || "操作未能启动");
      else setMessage(action === "dry-run" ? "预演任务已启动" : action === "revert" ? "还原任务已启动" : action === "force" ? "强制写入任务已启动" : "写入任务已启动");
      await refresh();
    } catch (e) { setError(String(e)); }
    finally { setWorking(false); }
  };

  const renderTarget = (target: Target) => <TargetCard key={target.key} target={target} checked={selected.includes(target.key)} disabled={!target.detected || Boolean(snapshot?.busy)} onToggle={() => toggle(target.key)} />;
  const groups = snapshot?.targets ?? [];
  return <div className="content-page clients-page">
    <div className="page-heading">
      <div><span className="eyebrow">CLIENT ENVIRONMENT</span><h1>客户端管理</h1><p>扫描本机 AI 客户端，查看配置状态并执行批量操作。</p></div>
      <button className="button-quiet" onClick={() => void refresh(true)} disabled={loading || Boolean(snapshot?.busy)}><RefreshCw size={14}/> 重新扫描</button>
    </div>
    <div className="client-summary">
      <div><span>已识别客户端</span><strong>{snapshot ? detected : "—"}<small> / 15</small></strong></div>
      <div><span>核心状态</span><strong className={snapshot?.core_ready ? "state-good" : "state-wait"}>{snapshot?.core_ready ? "已就绪" : "未就绪"}</strong></div>
      <div><span>当前任务</span><strong className={snapshot?.busy ? "state-wait" : ""}>{snapshot?.busy ? snapshot.busy_label || "执行中" : "空闲"}</strong></div>
      <div className="summary-meta">{loading ? "正在连接业务服务…" : snapshot?.core_file || "本地业务核心"}</div>
    </div>
    {error && <div className="backend-error"><AlertCircle size={16}/><span>{error}</span></div>}
    {message && <div className="backend-message"><CheckCircle2 size={16}/><span>{message}</span></div>}
    <div className="client-group-heading"><div><span className="eyebrow">PRIORITY CLIENTS</span><h2>重点客户端 <small>3</small></h2></div><span>独立检测逻辑</span></div>
    <div className="target-grid primary-targets">{groups.filter(t => primaryKeys.has(t.key)).map(renderTarget)}</div>
    <div className="client-group-heading"><div><span className="eyebrow">SUPPORTED CLIENTS</span><h2>其他客户端 <small>12</small></h2></div><span>统一配置规则</span></div>
    <div className="target-grid secondary-targets">{groups.filter(t => !primaryKeys.has(t.key)).map(renderTarget)}</div>
    {!snapshot && !loading && <div className="empty-state compact-empty"><AlertCircle size={22}/><strong>业务服务尚未连接</strong><p>桌面端桥接已经准备好，但原版 Python 业务服务尚未随桌面端自动启动。请先运行原版后台，之后此处会自动读取真实扫描结果。</p></div>}
    {snapshot && groups.length === 0 && <div className="empty-state compact-empty"><LoaderCircle size={22}/><strong>{snapshot.core_ready ? "正在扫描客户端…" : "正在加载核心…"}</strong><p>核心状态和扫描结果由原版服务异步提供。</p></div>}
    <div className="action-dock">
      <div className="selection-count"><strong>{selected.length}</strong><span>个目标已选</span></div>
      <button className="button-quiet" disabled={!selected.length || working || Boolean(snapshot?.busy)} onClick={() => void runAction("dry-run")}><ShieldCheck size={14}/> 预演</button>
      <button className="button-quiet" disabled={!selected.length || working || Boolean(snapshot?.busy)} onClick={() => void runAction("revert")}><RotateCcw size={14}/> 还原</button>
      <button className="button-primary" disabled={!selected.length || working || !snapshot?.core_ready || Boolean(snapshot?.busy)} onClick={() => void runAction("apply")}><Play size={14}/> 一键写入</button>
      <button className="button-danger" disabled={!selected.length || working || !snapshot?.core_ready || Boolean(snapshot?.busy)} onClick={() => void runAction("force")}><Square size={13}/> 强制覆盖</button>
    </div>
    <section className="live-log">
      <div className="log-heading"><div><Terminal size={15}/><strong>实时执行日志</strong></div><span>{logs.length} 条</span></div>
      <div className="log-lines">{logs.length ? logs.map((line, i) => <div key={i}>{line}</div>) : <span className="log-placeholder">等待业务核心输出…</span>}</div>
    </section>
  </div>;
}

function TargetCard({target,checked,disabled,onToggle}:{target:Target;checked:boolean;disabled:boolean;onToggle:()=>void}) {
  const status = target.detected ? target.state === "patched" ? "已配置" : target.state === "partial" ? "部分配置" : "已检测" : "未安装";
  return <button className={`target-card ${checked ? "is-selected" : ""} ${!target.detected ? "is-absent" : ""}`} onClick={onToggle} disabled={disabled || !target.detected}>
    <div className="target-card-top"><span className="target-select">{checked ? <CheckCircle2 size={16}/> : <Circle size={16}/>}</span><span className={`target-state ${target.detected ? "present" : "absent"}`}>{status}</span></div>
    <strong>{target.label}</strong>
    <div className="target-details">{(target.rows || []).slice(0,3).map((row,i)=><div key={i}><i className={row.state === "error" ? "bad" : row.state === "patched" || row.state === "ok" ? "good" : ""}/><span>{row.label}</span><small>{row.detail || row.state}</small></div>)}</div>
  </button>;
}
