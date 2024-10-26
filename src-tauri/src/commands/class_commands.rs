use tauri::State;
use crate::repository::Repository;
use crate::models::Class;
use crate::error::AppResult;

#[tauri::command]
pub async fn create_class(
    class: Class,
    repo: State<'_, Box<dyn Repository<Class> + Send + Sync>>,
) -> AppResult<i64> {
    repo.create(&class).await
}

#[tauri::command]
pub async fn get_class(
    id: i64,
    repo: State<'_, Box<dyn Repository<Class> + Send + Sync>>,
) -> AppResult<Class> {
    repo.get_by_id(id).await
}

#[tauri::command]
pub async fn get_all_classes(
    repo: State<'_, Box<dyn Repository<Class> + Send + Sync>>,
) -> AppResult<Vec<Class>> {
    repo.get_all().await
}

#[tauri::command]
pub async fn update_class(
    class: Class,
    repo: State<'_, Box<dyn Repository<Class> + Send + Sync>>,
) -> AppResult<()> {
    repo.update(&class).await
}

#[tauri::command]
pub async fn delete_class(
    id: i64,
    repo: State<'_, Box<dyn Repository<Class> + Send + Sync>>,
) -> AppResult<()> {
    repo.delete(id).await
}
