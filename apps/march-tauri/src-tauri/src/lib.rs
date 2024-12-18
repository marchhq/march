// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Determine the URL to load based on the build mode
    let url = if cfg!(debug_assertions) {
        // Development mode
        "http://localhost:3000".to_string()
    } else {
        // Production mode
        "https://app.march.cat".to_string()
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(move |app| {
            // Access the default "main" window and set its URL
            let main_window = app.get_webview_window("main").unwrap();
            main_window.eval(&format!("window.location.replace('{}');", url))?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
