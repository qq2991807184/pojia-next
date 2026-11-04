# 破甲桌面端重构框架

本目录是独立的 Tauri 2 + Rust + React + TypeScript 桌面端新框架，与仓库现有 Python 程序并行保留，不覆盖旧版入口或业务文件。

## 开发环境

- Node.js 20+
- Rust stable
- Windows 10/11 WebView2
- Tauri 2 所需 Windows C++ Build Tools

## 启动

在本目录执行：

```powershell
npm install
npm run tauri dev
```

## 构建

```powershell
npm run tauri build
```

## 当前状态

- 已建立左侧可折叠导航、顶部自定义标题栏、主工作区和状态栏。
- 侧栏折叠状态保存在本地浏览器存储中，品牌区域随侧栏整体收缩。
- 提示词编辑器初始为空，不含预设正文。
- 业务页面先建立入口，不使用虚构扫描数据。
- 已接入 Windows 系统托盘菜单：显示主界面、完全退出；点击窗口关闭按钮会隐藏到托盘，进程继续运行。
- 已将仓库现有 `icon.ico` 配置为桌面应用打包图标来源。
- 尚未迁移旧版 Python 业务逻辑；客户端扫描、配置读写、备份恢复和设置需在后续阶段逐项接入并验收。
- 托盘和窗口行为尚未经过 Windows 实机运行验证；当前代码已提交，仍需构建与运行验收。
