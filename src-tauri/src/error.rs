use serde::{Serialize, Deserialize};
use thiserror::Error;

#[derive(Debug, Error, Serialize, Deserialize)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(String),
    
    #[error("Not found with id: {0}")]
    NotFound(i64),
    
    #[error("Validation error: {0}")]
    Validation(String),

    #[error("Connection pool error: {0}")]
    ConnectionPool(String),
}

pub type AppResult<T> = Result<T, AppError>;

// Bestehende Konvertierung für rusqlite::Error
impl From<rusqlite::Error> for AppError {
    fn from(err: rusqlite::Error) -> Self {
        AppError::Database(err.to_string())
    }
}

// Neue Konvertierung für r2d2::Error
impl From<r2d2::Error> for AppError {
    fn from(err: r2d2::Error) -> Self {
        AppError::ConnectionPool(err.to_string())
    }
}

// Optional: Konvertierung für spezifische Pool-Errors
/* impl From<r2d2_sqlite::rusqlite::Error> for AppError {
    fn from(err: r2d2_sqlite::rusqlite::Error) -> Self {
        AppError::Database(err.to_string())
    }
} */