use serde::{Serialize, Deserialize};
use thiserror::Error;

#[derive(Debug, Error, Serialize, Deserialize)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(String),  // Geändert von rusqlite::Error zu String
    
    #[error("Not found with id: {0}")]
    NotFound(i64),
    
    #[error("Validation error: {0}")]
    Validation(String),
}

pub type AppResult<T> = Result<T, AppError>;

// Hilfsfunktion zum Konvertieren von rusqlite::Error
impl From<rusqlite::Error> for AppError {
    fn from(err: rusqlite::Error) -> Self {
        AppError::Database(err.to_string())
    }
}