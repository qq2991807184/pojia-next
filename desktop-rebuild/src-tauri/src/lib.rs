use serde_json::Value;
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Manager, WindowEvent,
};


#[tauri::command]
async fn backend_request(method: String, path: String, body: Option<Value>) -> Result<Value, String> {
    if !path.starts_with("/api/") || path.contains("..") {
        return Err("非法的本地接口路径".into());
    }
    let method = match method.as_str() {
        "GET" => reqwest::Method::GET,
        "POST" => reqwest::Method::POST,
        _ => return Err("不支持的请求方法".into()),
    };
    let client = reqwest::Client::builder()
        .connect_timeout(std::time::Duration::from_millis(350))
        .timeout(std::time::Duration::from_secs(45))
        .build()
        .map_err(|e| e.to_string())?;
    for port in 8317..=8336 {
        let url = format!("http://127.0.0.1:{}{}", port, path);
        let mut request = client.request(method.clone(), &url);
        if method == reqwest::Method::POST {
            request = request.json(&body.clone().unwrap_or(Value::Null));
        }
        match request.send().await {
            Ok(response) => {
                let status = response.status();
                let value = response.json::<Value>().await
                    .map_err(|e| format!("本地服务返回了无法解析的数据：{}", e))?;
                if status.is_success() || status.as_u16() == 409 || status.as_u16() == 503 {
                    return Ok(value);
                }
                return Err(value.get("err").and_then(Value::as_str)
                    .unwrap_or("本地服务请求失败").to_string());
            }
            Err(_) => continue,
        }
    }
    Err("未连接到破甲业务核心。请先启动原版破甲后台，或等待桌面端业务服务完成打包接入。".into())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![backend_request])
        .plugin(tauri_plugin_autostart::init(tauri_plugin_autostart::MacosLauncher::LaunchAgent, None))
        .plugin(tauri_plugin_single_instance::init(|app, _, _| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.unminimize();
                let _ = window.set_focus();
            }
        }))
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            let show = MenuItem::with_id(app, "tray-show", "显示破甲", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "tray-quit", "完全退出", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show, &quit])?;
            let mut tray = TrayIconBuilder::with_id("main-tray")
                .tooltip("破甲")
                .menu(&menu)
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "tray-show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.unminimize();
                            let _ = window.set_focus();
                        }
                    }
                    "tray-quit" => app.exit(0),
                    _ => {}
                });
            if let Some(icon) = app.default_window_icon() {
                tray = tray.icon(icon.clone());
            }
            tray.build(app)?;
            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .run(tauri::generate_context!())
        .expect("启动破甲桌面端失败");
}
