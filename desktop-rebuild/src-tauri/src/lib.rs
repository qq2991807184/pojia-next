#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|_app| {
            // Native window and tray behavior will be wired here in the desktop integration phase.
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("启动破甲桌面端失败");
}