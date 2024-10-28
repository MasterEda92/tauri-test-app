use tauri::State;
use crate::repository::Repository;
use crate::models::Subject;
use crate::error::AppResult;

#[tauri::command]
pub async fn create_subject(
    subject: Subject,
    repo: State<'_, Box<dyn Repository<Subject> + Send + Sync>>,
) -> AppResult<i64> {
    repo.create(&subject).await
}

#[tauri::command]
pub async fn get_subject(
    id: i64,
    repo: State<'_, Box<dyn Repository<Subject> + Send + Sync>>,
) -> AppResult<Subject> {
    repo.get_by_id(id).await
}

#[tauri::command]
pub async fn get_all_subjects(
    repo: State<'_, Box<dyn Repository<Subject> + Send + Sync>>,
) -> AppResult<Vec<Subject>> {
    repo.get_all().await
}

#[tauri::command]
pub async fn update_subject(
    subject: Subject,
    repo: State<'_, Box<dyn Repository<Subject> + Send + Sync>>,
) -> AppResult<()> {
    repo.update(&subject).await
}

#[tauri::command]
pub async fn delete_subject(
    id: i64,
    repo: State<'_, Box<dyn Repository<Subject> + Send + Sync>>,
) -> AppResult<()> {
    repo.delete(id).await
}