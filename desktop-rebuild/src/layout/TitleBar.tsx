import { Minus, Square, X, Command, ExternalLink } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function TitleBar({ title }: { title: string }) {
  const win = getCurrentWindow();
  return <header className="titlebar" data-tauri-drag-region>
    <div className="titlebar-page">{title}</div>
    <div className="titlebar-actions" data-tauri-drag-region="false">
      <button className="quick-link" title="GitHub 地址待配置"><Command size={15}/><span>GitHub</span><ExternalLink size={11}/></button>
      <span className="titlebar-divider"/>
      <button className="window-btn" title="最小化" onClick={() => win.minimize()}><Minus size={15}/></button>
      <button className="window-btn" title="最大化/还原" onClick={() => win.toggleMaximize()}><Square size={13}/></button>
      <button className="window-btn close" title="关闭" onClick={() => win.close()}><X size={16}/></button>
    </div>
  </header>;
}