use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Subject {
    pub id: Option<i64>,
    pub name: String,
    pub short_name: String,
}