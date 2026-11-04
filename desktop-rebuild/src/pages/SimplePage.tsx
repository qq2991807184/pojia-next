import { Boxes, FileSliders, Archive, ShieldCheck, Settings2, Puzzle } from "lucide-react";
import type { PageKey } from "../App";
const info: Partial<Record<PageKey,{title:string;desc:string;icon:typeof Boxes;label:string}>> = {
  clients:{title:"客户端管理",desc:"统一识别本机 AI 编程客户端及其配置位置。",icon:Puzzle,label:"客户端扫描"},
  configs:{title:"配置方案",desc:"管理配置规则、方案与变更预览。",icon:FileSliders,label:"配置管理"},
  backups:{title:"备份中心",desc:"查看备份记录、校验完整性并恢复配置。",icon:Archive,label:"备份与恢复"},
  checks:{title:"生效检查",desc:"检查配置写入结果、冲突与最终生效状态。",icon:ShieldCheck,label:"验证中心"},
  settings:{title:"应用设置",desc:"管理外观、窗口行为、托盘与应用偏好。",icon:Settings2,label:"偏好设置"}
};
export function SimplePage({page}:{page:PageKey}) {
 const item=info[page] ?? info.clients!; const Icon=item.icon;
 return <div className="content-page"><div className="page-heading"><div><span className="eyebrow">{item.label}</span><h1>{item.title}</h1><p>{item.desc}</p></div></div><section className="empty-state"><div className="empty-icon"><Icon size={24}/></div><strong>业务模块待接入</strong><p>页面入口与布局已经建立。接下来会从原项目迁移并验证对应能力，不用示例数据代替真实结果。</p></section></div>;
}