// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use std::process::Command;
use std::thread;
use std::time::Duration;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_app_version,
            get_system_info,
            minimize_window,
            maximize_window,
            close_window
        ])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }

            // Start the Next.js server
            start_server();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn start_server() {
    thread::spawn(|| {
        #[cfg(target_os = "windows")]
        {
            let mut child = Command::new("node")
                .args([".next/standalone/server.js", "3000"])
                .current_dir(".")
                .spawn()
                .expect("Failed to start server");

            // Give server time to start
            thread::sleep(Duration::from_secs(5));

            // Keep the child alive
            let _ = child.wait();
        }

        #[cfg(not(target_os = "windows"))]
        {
            let mut child = Command::new("node")
                .args([".next/standalone/server.js", "3000"])
                .current_dir(".")
                .spawn()
                .expect("Failed to start server");

            // Give server time to start
            thread::sleep(Duration::from_secs(5));

            // Keep the child alive
            let _ = child.wait();
        }
    });
}

// Tauri Commands
#[tauri::command]
fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[tauri::command]
fn get_system_info() -> serde_json::Value {
    serde_json::json!({
        "platform": std::env::consts::OS,
        "arch": std::env::consts::ARCH,
        "version": env!("CARGO_PKG_VERSION")
    })
}

#[tauri::command]
fn minimize_window(window: tauri::Window) {
    window.minimize().unwrap();
}

#[tauri::command]
fn maximize_window(window: tauri::Window) {
    window.set_maximized(!window.is_maximized().unwrap()).unwrap();
}

#[tauri::command]
fn close_window(window: tauri::Window) {
    window.close().unwrap();
}
