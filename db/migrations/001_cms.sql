CREATE TABLE IF NOT EXISTS subscription_plans (
  code VARCHAR(64) PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  monthly_price_cents INTEGER NOT NULL CHECK (monthly_price_cents >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE IF NOT EXISTS companies (
  id VARCHAR(64) PRIMARY KEY NOT NULL CHECK (CHAR_LENGTH(id) > 0),
  name TEXT NOT NULL,
  plan_code VARCHAR(64) NOT NULL,
  is_sample INTEGER NOT NULL DEFAULT 0 CHECK (is_sample IN (0, 1)),
  FOREIGN KEY (plan_code) REFERENCES subscription_plans(code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE IF NOT EXISTS cms_block_types (
  code VARCHAR(64) PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  minimum_plan_code VARCHAR(64) NOT NULL,
  FOREIGN KEY (minimum_plan_code) REFERENCES subscription_plans(code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE IF NOT EXISTS cms_revisions (
  company_id VARCHAR(64) NOT NULL,
  version INTEGER NOT NULL CHECK (version > 0),
  status VARCHAR(16) NOT NULL CHECK (status IN ('draft', 'submitted', 'approved')),
  saved_at VARCHAR(32),
  submitted_at VARCHAR(32),
  approved_at VARCHAR(32),
  theme TEXT NOT NULL CHECK (theme IN ('editorial', 'slate')),
  accent TEXT NOT NULL,
  background TEXT NOT NULL,
  logo_url MEDIUMTEXT NOT NULL,
  logo_alt TEXT NOT NULL,
  show_contact INTEGER NOT NULL CHECK (show_contact IN (0, 1)),
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_address TEXT NOT NULL,
  PRIMARY KEY (company_id, version),
  CHECK (status <> 'submitted' OR submitted_at IS NOT NULL),
  CHECK (status <> 'draft' OR submitted_at IS NULL),
  CHECK ((status = 'approved') = (approved_at IS NOT NULL)),
  FOREIGN KEY (company_id) REFERENCES companies(id),
  INDEX cms_revisions_review_queue (status, submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE IF NOT EXISTS cms_company_heads (
  company_id VARCHAR(64) PRIMARY KEY NOT NULL,
  work_version INTEGER NOT NULL,
  published_version INTEGER NOT NULL,
  FOREIGN KEY (company_id, work_version) REFERENCES cms_revisions(company_id, version),
  FOREIGN KEY (company_id, published_version) REFERENCES cms_revisions(company_id, version),
  FOREIGN KEY (company_id) REFERENCES companies(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE IF NOT EXISTS cms_pages (
  company_id VARCHAR(64) NOT NULL,
  version INTEGER NOT NULL,
  locale VARCHAR(2) NOT NULL CHECK (locale IN ('hy', 'en', 'ru')),
  display_name TEXT NOT NULL,
  cta_label TEXT NOT NULL,
  cta_href TEXT NOT NULL,
  copyright TEXT NOT NULL,
  PRIMARY KEY (company_id, version, locale),
  FOREIGN KEY (company_id, version) REFERENCES cms_revisions(company_id, version) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE IF NOT EXISTS cms_navigation_links (
  company_id VARCHAR(64) NOT NULL,
  version INTEGER NOT NULL,
  locale VARCHAR(2) NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 0),
  label TEXT NOT NULL,
  anchor TEXT NOT NULL,
  PRIMARY KEY (company_id, version, locale, position),
  FOREIGN KEY (company_id, version, locale) REFERENCES cms_pages(company_id, version, locale) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE IF NOT EXISTS cms_footer_links (
  company_id VARCHAR(64) NOT NULL,
  version INTEGER NOT NULL,
  locale VARCHAR(2) NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 0),
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  PRIMARY KEY (company_id, version, locale, position),
  FOREIGN KEY (company_id, version, locale) REFERENCES cms_pages(company_id, version, locale) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

CREATE TABLE IF NOT EXISTS cms_blocks (
  company_id VARCHAR(64) NOT NULL,
  version INTEGER NOT NULL,
  locale VARCHAR(2) NOT NULL,
  block_id VARCHAR(128) NOT NULL CHECK (length(block_id) > 0),
  type_code VARCHAR(64) NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 0),
  label TEXT NOT NULL,
  hidden INTEGER NOT NULL CHECK (hidden IN (0, 1)),
  anchor TEXT NOT NULL,
  spacing TEXT NOT NULL CHECK (spacing IN ('compact', 'normal', 'relaxed')),
  width TEXT NOT NULL CHECK (width IN ('narrow', 'standard', 'wide')),
  tone TEXT NOT NULL CHECK (tone IN ('default', 'muted', 'accent', 'ink')),
  content_json JSON NOT NULL CHECK (JSON_TYPE(content_json) = 'OBJECT'),
  options_json JSON NOT NULL CHECK (JSON_TYPE(options_json) = 'OBJECT'),
  PRIMARY KEY (company_id, version, locale, position),
  UNIQUE (company_id, version, locale, block_id),
  FOREIGN KEY (company_id, version, locale) REFERENCES cms_pages(company_id, version, locale) ON DELETE CASCADE,
  FOREIGN KEY (type_code) REFERENCES cms_block_types(code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

