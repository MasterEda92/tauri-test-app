use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Class {
    pub id: Option<i64>,
    pub name: String,
    pub grade: i32,
    pub section: String,
}