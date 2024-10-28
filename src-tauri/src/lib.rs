mod models;
mod error;
mod repository;
mod commands;
mod db;

use crate::db::create_pool;
use repository::{Repository, SqliteClassRepository, SqliteSubjectRepository};
use models::Class;
use models::Subject;
use commands::*;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Erstelle Connection Pool
    let pool = create_pool("app.db");
    
    // Repositories erstellen
    let class_repo = SqliteClassRepository::new(pool.clone());
    let subject_repo = SqliteSubjectRepository::new(pool);
    
    // Repositories initialisieren
    class_repo.init().expect("Failed to initialize class repository");
    subject_repo.init().expect("Failed to initialize subject repository");


    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(Box::new(class_repo) as Box<dyn Repository<Class> + Send + Sync>)
        .manage(Box::new(subject_repo) as Box<dyn Repository<Subject> + Send + Sync>)
        .invoke_handler(tauri::generate_handler![
            greet,
            create_class,
            get_class,
            get_all_classes,
            update_class,
            delete_class,
            create_subject,
            get_subject,
            get_all_subjects,
            update_subject,
            delete_subject
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
