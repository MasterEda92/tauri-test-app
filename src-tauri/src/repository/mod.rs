mod class_repository;

use async_trait::async_trait;
use crate::error::AppResult;

#[async_trait]
pub trait Repository<T> {
    async fn create(&self, item: &T) -> AppResult<i64>;
    async fn get_by_id(&self, id: i64) -> AppResult<T>;
    async fn get_all(&self) -> AppResult<Vec<T>>;
    async fn update(&self, item: &T) -> AppResult<()>;
    async fn delete(&self, id: i64) -> AppResult<()>;
}

pub use class_repository::SqliteClassRepository;