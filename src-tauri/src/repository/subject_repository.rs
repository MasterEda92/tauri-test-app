use crate::db::DbPool;
use crate::models::Subject;
use crate::error::{AppError, AppResult};
use async_trait::async_trait;
use super::Repository;

pub struct SqliteSubjectRepository {
    pool: DbPool,
}

impl SqliteSubjectRepository {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }
    
    pub fn init(&self) -> AppResult<()> {
        let conn = self.pool.get()?;
        conn.execute(
            "CREATE TABLE IF NOT EXISTS subjects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                short_name TEXT NOT NULL
            )",
            [],
        )?;
        Ok(())
    }
}

#[async_trait]
impl Repository<Subject> for SqliteSubjectRepository {
    async fn create(&self, subject: &Subject) -> AppResult<i64> {
        let conn = self.pool.get()?;
        conn.execute(
            "INSERT INTO subjects (name, short_name) VALUES (?1, ?2)",
            (&subject.name, &subject.short_name),
        )?;
        Ok(conn.last_insert_rowid())
    }
    
    async fn get_by_id(&self, id: i64) -> AppResult<Subject> {
        let conn = self.pool.get()?;
        conn.query_row(
            "SELECT id, name, short_name FROM subjects WHERE id = ?1",
            [id],
            |row| {
                Ok(Subject {
                    id: Some(row.get(0)?),
                    name: row.get(1)?,
                    short_name: row.get(2)?,
                })
            },
        ).map_err(|e| match e {
            rusqlite::Error::QueryReturnedNoRows => AppError::NotFound(id),
            e => AppError::Database(e.to_string()),
        })
    }
    
    async fn get_all(&self) -> AppResult<Vec<Subject>> {
        let conn = self.pool.get()?;
        let mut stmt = conn.prepare("SELECT id, name, short_name FROM subjects")?;
        let subjects = stmt.query_map([], |row| {
            Ok(Subject {
                id: Some(row.get(0)?),
                name: row.get(1)?,
                short_name: row.get(2)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
        Ok(subjects)
    }
    
    async fn update(&self, subject: &Subject) -> AppResult<()> {
        let conn = self.pool.get()?;
        let id = subject.id.ok_or_else(|| AppError::Validation("Subject id is required for update".into()))?;
        
        let rows_affected = conn.execute(
            "UPDATE subjects SET name = ?1, short_name = ?2 WHERE id = ?3",
            (&subject.name, &subject.short_name, &id),
        )?;
        
        if rows_affected == 0 {
            return Err(AppError::NotFound(id));
        }
        
        Ok(())
    }
    
    async fn delete(&self, id: i64) -> AppResult<()> {
        let conn = self.pool.get()?;
        let rows_affected = conn.execute("DELETE FROM subjects WHERE id = ?1", [id])?;
        
        if rows_affected == 0 {
            return Err(AppError::NotFound(id));
        }
        
        Ok(())
    }
}
