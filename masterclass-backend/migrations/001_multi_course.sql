-- ===========================================================================
-- 001 — multi-course backend
--
-- Turns a single-course backend into a registry-driven one. After this, adding
-- a course site is a row in `courses` plus a slug in the site's config — no
-- schema change and no PHP deploy.
--
-- RUN ONCE, in phpMyAdmin → SQL. EXPORT THE DATABASE FIRST: this alters tables
-- that already hold real leads and the live-class row.
--
-- Statements are ordered so each one's assumptions hold when it runs. Don't
-- reorder them.
-- ===========================================================================


-- 1 ------------------------------------------------------------------------
-- The registry. Every other table keys off `slug`, and every course site
-- identifies itself with one.

CREATE TABLE IF NOT EXISTS courses (
  id         SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug       VARCHAR(60)  NOT NULL,
  name       VARCHAR(120) NOT NULL,
  -- Where the public site lives. Only used to give the admin a "view site"
  -- link; nothing depends on it being correct.
  site_url   VARCHAR(200) NULL,
  -- Soft delete. Deactivating hides a course from the site dropdown and
  -- rejects new leads for it, without destroying historical leads.
  active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 2 ------------------------------------------------------------------------
-- Seed the course that already exists. The slug matches the folder the site is
-- deployed to, which keeps the mental model simple:
--   edufulness.com/data-engineering/  ->  slug 'data-engineering'

INSERT IGNORE INTO courses (slug, name, site_url) VALUES
  ('data-engineering', 'Azure Data Engineering', 'https://edufulness.com/data-engineering/');


-- 3 ------------------------------------------------------------------------
-- Leads: replace the free-text `source` with a real foreign key.
--
-- `source` was a VARCHAR validated only by a regex, so a typo in one site's
-- config would silently file leads under a course that doesn't exist. A FK
-- makes that impossible.

ALTER TABLE leads
  ADD COLUMN course_id SMALLINT UNSIGNED NULL AFTER message;

-- Backfill. Existing rows were written with source = 'azure' before the folder
-- was renamed, so map that to the data-engineering course. The second UPDATE
-- catches anything written after the rename.
UPDATE leads l
  JOIN courses c ON c.slug = 'data-engineering'
  SET l.course_id = c.id
  WHERE l.source IN ('azure', 'data-engineering') AND l.course_id IS NULL;

-- Anything with an unrecognised source also goes to the first course rather
-- than being lost — a stray lead is worth more than a clean schema.
UPDATE leads l
  JOIN courses c ON c.slug = 'data-engineering'
  SET l.course_id = c.id
  WHERE l.course_id IS NULL;

ALTER TABLE leads
  MODIFY COLUMN course_id SMALLINT UNSIGNED NOT NULL,
  ADD KEY idx_course (course_id),
  -- RESTRICT, not CASCADE: deleting a course must never silently delete its
  -- leads. Deactivate instead.
  ADD CONSTRAINT fk_leads_course
      FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE RESTRICT;

-- `source` is now redundant. Kept for one release as a safety net; drop it
-- once you've confirmed the dashboard shows every historical lead correctly.
-- ALTER TABLE leads DROP COLUMN source;


-- 4 ------------------------------------------------------------------------
-- Live class: one row per course instead of a single fixed row.

ALTER TABLE live_class
  ADD COLUMN course_id SMALLINT UNSIGNED NULL AFTER id;

UPDATE live_class lc
  JOIN courses c ON c.slug = 'data-engineering'
  SET lc.course_id = c.id
  WHERE lc.course_id IS NULL;

-- The old table had a fixed PRIMARY KEY (id) with a DEFAULT of 1, which only
-- makes sense for a single row. Swap to a normal auto-increment keyed by
-- course, so each course gets exactly one row.
ALTER TABLE live_class
  MODIFY COLUMN id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  MODIFY COLUMN course_id SMALLINT UNSIGNED NOT NULL,
  ADD UNIQUE KEY uniq_course (course_id),
  ADD CONSTRAINT fk_live_course
      FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE;
-- CASCADE here, unlike leads: a course's live-class settings are configuration,
-- not records worth preserving.
