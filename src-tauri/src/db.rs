use r2d2::Pool;
use r2d2_sqlite::SqliteConnectionManager;

pub type DbPool = Pool<SqliteConnectionManager>;

pub fn create_pool(database_url: &str) -> DbPool {
    let manager = SqliteConnectionManager::file(database_url);
    Pool::new(manager).expect("Failed to create database pool")
}