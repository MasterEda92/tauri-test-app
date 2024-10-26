mod models;
mod error;
mod repository;
mod commands;

use repository::{Repository, SqliteClassRepository};
use models::Class;
use commands::*;
use rusqlite::Connection;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    //let db = init_db();
    let conn = Connection::open("app.db").expect("Failed to open database");
    let repo = SqliteClassRepository::new(conn);
    repo.init().expect("Failed to initialize database");


    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(Box::new(repo) as Box<dyn Repository<Class> + Send + Sync>)
        .invoke_handler(tauri::generate_handler![
            greet,
            create_class,
            get_class,
            get_all_classes,
            update_class,
            delete_class
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
