CREATE TABLE IF NOT EXISTS platform_homepage (
  content_key VARCHAR(8) PRIMARY KEY,
  version INT UNSIGNED NOT NULL DEFAULT 0,
  content_json JSON NOT NULL,
  CHECK (content_key IN ('hy', 'en', 'ru', 'settings')),
  CHECK (JSON_TYPE(content_json) = 'OBJECT')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

INSERT IGNORE INTO platform_homepage (content_key, content_json)
VALUES ('hy', JSON_OBJECT()), ('en', JSON_OBJECT()), ('ru', JSON_OBJECT()), ('settings', JSON_OBJECT());
