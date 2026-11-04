param(
  [string]$Python = "python"
)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Legacy = Join-Path $Root "legacy-source"
$Gui = Join-Path $Legacy "破甲GUI.py"
$Core = Join-Path $Legacy "破甲一键通.py"
$Launcher = Join-Path $Legacy "run_v1.py"
if (!(Test-Path $Gui) -or !(Test-Path $Core)) {
  throw "缺少旧版源码。请将交接包中的「破甲GUI.py」「破甲一键通.py」「run_v1.py」放入 desktop-rebuild/legacy-source/。"
}
if (!(Test-Path $Launcher)) {
  throw "缺少 run_v1.py；请从原版源码交接包一并复制。"
}
Write-Host "启动旧版业务服务（无浏览器模式）。保持此窗口运行，再启动 Tauri 桌面端。"
& $Python $Launcher --no-browser
if ($LASTEXITCODE -ne 0) {
  throw "旧版业务服务退出，代码：$LASTEXITCODE"
}
