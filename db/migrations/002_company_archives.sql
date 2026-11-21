CREATE TABLE IF NOT EXISTS cms_archived_companies (
  company_id VARCHAR(64) PRIMARY KEY,
  archived_at VARCHAR(32) NOT NULL,
  FOREIGN KEY (company_id) REFERENCES companies(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;
