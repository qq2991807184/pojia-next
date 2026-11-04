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
- 侧栏折叠状态在桌面端保存在 Tauri Store 中，首次迁移时兼容读取旧版 localStorage 设置；品牌区域随侧栏整体收缩。
- 提示词编辑器初始为空，不含预设正文；桌面端通过 Tauri Store 将内容保存到应用数据文件，浏览器预览才使用 localStorage。
- 业务页面先建立入口，不使用虚构扫描数据。
- 已接入 Windows 系统托盘菜单：显示主界面、完全退出；点击窗口关闭按钮会隐藏到托盘，进程继续运行。
- 已接入 Tauri Store 持久化插件，并开放对应窗口能力权限；提示词保存不再依赖桌面 WebView 的浏览器缓存。
- 已接入单实例插件：重复启动时唤醒现有主窗口，不再创建第二个进程。
- 已接入窗口状态插件，并开放状态保存/恢复权限，用于恢复上次窗口尺寸、位置和最大化状态。
- 设置页显示本地存储方式和当前版本状态，并接入真实的 Windows 开机自启动开关；默认关闭，只有用户主动开启才注册系统启动项。
- 已将仓库现有 `icon.ico` 配置为桌面应用打包图标来源。
- 尚未迁移旧版业务逻辑。当前 `main` 分支公开 Git 树中未包含 `破甲GUI.py` 与 `破甲一键通.py`，因此不能据 README 描述臆造或重写业务实现；迁移前必须取得可审查的真实核心源码。
- GitHub Actions Windows 检查已通过：前端生产构建与 Rust `cargo check` 均成功（run `41803102751`）。这仅代表编译检查通过，不等于 Windows 实机运行验收；单实例、窗口状态恢复、托盘、Store 持久化和开机自启动仍待实机验证。
