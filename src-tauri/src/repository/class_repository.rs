use crate::models::Class;
use crate::error::{AppError, AppResult};
use async_trait::async_trait;
use rusqlite::Connection;
use std::sync::Mutex;
use super::Repository;

pub struct SqliteClassRepository {
    conn: Mutex<Connection>,
}

impl SqliteClassRepository {
    pub fn new(conn: Connection) -> Self {
        Self {
            conn: Mutex::new(conn)
        }
    }
    
    pub fn init(&self) -> AppResult<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "CREATE TABLE IF NOT EXISTS classes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                grade INTEGER NOT NULL,
                section TEXT NOT NULL
            )",
            [],
        )?;
        Ok(())
    }
}

#[async_trait]
impl Repository<Class> for SqliteClassRepository {
    async fn create(&self, class: &Class) -> AppResult<i64> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT INTO classes (name, grade, section) VALUES (?1, ?2, ?3)",
            (&class.name, &class.grade, &class.section),
        )?;
        Ok(conn.last_insert_rowid())
    }
    
    async fn get_by_id(&self, id: i64) -> AppResult<Class> {
        let conn = self.conn.lock().unwrap();
        conn.query_row(
            "SELECT id, name, grade, section FROM classes WHERE id = ?1",
            [id],
            |row| {
                Ok(Class {
                    id: Some(row.get(0)?),
                    name: row.get(1)?,
                    grade: row.get(2)?,
                    section: row.get(3)?,
                })
            },
        ).map_err(|e| match e {
            rusqlite::Error::QueryReturnedNoRows => AppError::NotFound(id),
            e => AppError::Database(e.to_string()),
        })
    }
    
    async fn get_all(&self) -> AppResult<Vec<Class>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT id, name, grade, section FROM classes")?;
        let classes = stmt.query_map([], |row| {
            Ok(Class {
                id: Some(row.get(0)?),
                name: row.get(1)?,
                grade: row.get(2)?,
                section: row.get(3)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
        Ok(classes)
    }
    
    async fn update(&self, class: &Class) -> AppResult<()> {
        let conn = self.conn.lock().unwrap();
        let id = class.id.ok_or_else(|| AppError::Validation("Class id is required for update".into()))?;
        
        let rows_affected = conn.execute(
            "UPDATE classes SET name = ?1, grade = ?2, section = ?3 WHERE id = ?4",
            (&class.name, &class.grade, &class.section, &id),
        )?;
        
        if rows_affected == 0 {
            return Err(AppError::NotFound(id));
        }
        
        Ok(())
    }
    
    async fn delete(&self, id: i64) -> AppResult<()> {
        let conn = self.conn.lock().unwrap();
        let rows_affected = conn.execute("DELETE FROM classes WHERE id = ?1", [id])?;
        
        if rows_affected == 0 {
            return Err(AppError::NotFound(id));
        }
        
        Ok(())
    }
}
