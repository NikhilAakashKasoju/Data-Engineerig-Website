-- Run once in hPanel → Databases → phpMyAdmin → SQL tab.
--
-- utf8mb4 throughout: names and messages will contain emoji and non-Latin
-- characters, and plain `utf8` in MySQL is a 3-byte encoding that silently
-- mangles them.

CREATE TABLE IF NOT EXISTS leads (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(120)  NOT NULL,
  email       VARCHAR(190)  NOT NULL,
  message     TEXT          NULL,
  -- Which course page produced the lead. Added now so the DSA site can share
  -- this table later instead of needing its own.
  source      VARCHAR(60)   NOT NULL DEFAULT 'azure',
  status      ENUM('new','contacted','archived') NOT NULL DEFAULT 'new',
  ip          VARCHAR(45)   NULL,
  user_agent  VARCHAR(255)  NULL,
  notified    TINYINT(1)    NOT NULL DEFAULT 0,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_created (created_at),
  KEY idx_status  (status),
  KEY idx_email   (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Editable content for the Live Classes section.
--
-- Deliberately a single fixed row (id = 1) rather than a list: the page shows
-- one upcoming session, so a table of many would need "which one is current?"
-- logic that nothing actually needs yet.
--
-- starts_at is stored as one DATETIME rather than separate day/month/text
-- fields, so the calendar tile and the long-form date can never disagree.
-- Times are entered and displayed as IST; no timezone conversion happens.
CREATE TABLE IF NOT EXISTS live_class (
  id            TINYINT UNSIGNED NOT NULL DEFAULT 1,
  enabled       TINYINT(1)    NOT NULL DEFAULT 1,
  topic         VARCHAR(200)  NOT NULL,
  starts_at     DATETIME      NOT NULL,
  duration      VARCHAR(60)   NOT NULL DEFAULT '90 minutes',
  mode_text     VARCHAR(80)   NOT NULL DEFAULT 'Online · free to attend',
  blurb         TEXT          NULL,
  -- One highlight per line. A TEXT column keeps the admin form a plain
  -- textarea; a child table would be three joins for something never queried.
  highlights    TEXT          NULL,
  register_url  VARCHAR(400)  NOT NULL,
  register_note VARCHAR(80)   NOT NULL DEFAULT 'No payment required',
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed the single row so the admin form always has something to edit.
INSERT IGNORE INTO live_class
  (id, enabled, topic, starts_at, duration, blurb, highlights, register_url)
VALUES (
  1, 1,
  'Building a Metadata-Driven Ingestion Framework in ADF',
  '2026-08-22 10:00:00',
  '90 minutes',
  'A working session on the pattern that separates senior data engineers from everyone else: one pipeline, driven by metadata tables, handling full and incremental loads across any number of sources.',
  'Design the source and target metadata tables\nDrive a single pipeline with ForEach and dynamic content\nLive Q&A with Atchyut at the end',
  'https://whatsapp.com/channel/0029Val125n2UPBNAPAprU1G'
);

-- Throttling for both form submissions and admin login attempts.
-- Rows are pruned on write, so this never grows unbounded.
CREATE TABLE IF NOT EXISTS rate_limit (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  bucket     VARCHAR(32)  NOT NULL,
  ip         VARCHAR(45)  NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_bucket_ip (bucket, ip, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
