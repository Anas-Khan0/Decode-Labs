-- ============================================================
--  Book Library — Database Schema (Pillar 1: The Blueprint)
--  Demonstrates: Primary Keys, Foreign Keys, and strict
--  integrity constraints (NOT NULL, UNIQUE, CHECK).
--  Relationship: authors (1) ──< books (Many)  [One-to-Many]
-- ============================================================

-- Drop in dependency order (books references authors)
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS authors CASCADE;

-- ------------------------------------------------------------
--  AUTHORS
-- ------------------------------------------------------------
CREATE TABLE authors (
    id          SERIAL PRIMARY KEY,                 -- Primary Key: unique identifier
    name        VARCHAR(120) NOT NULL,              -- NOT NULL: must always be provided
    email       VARCHAR(160) NOT NULL UNIQUE,       -- UNIQUE: no duplicate author emails
    country     VARCHAR(80),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
--  BOOKS
-- ------------------------------------------------------------
CREATE TABLE books (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    isbn            VARCHAR(20)  NOT NULL UNIQUE,    -- UNIQUE: each book has one ISBN
    -- Foreign Key: structural glue back to authors.id.
    -- ON DELETE CASCADE => deleting an author removes their books too.
    author_id       INTEGER NOT NULL
                    REFERENCES authors(id) ON DELETE CASCADE,
    price           NUMERIC(8,2) NOT NULL DEFAULT 0
                    CHECK (price >= 0),             -- CHECK: price can never be negative
    published_year  INTEGER
                    CHECK (published_year BETWEEN 1450 AND 2100),
    in_stock        BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helpful index for the most common lookup (books of an author)
CREATE INDEX idx_books_author_id ON books(author_id);

-- ============================================================
--  SEED DATA (optional starter rows)
-- ============================================================
INSERT INTO authors (name, email, country) VALUES
    ('George Orwell',      'orwell@example.com',   'United Kingdom'),
    ('Chinua Achebe',      'achebe@example.com',   'Nigeria'),
    ('Bano Qudsia',        'bano@example.com',     'Pakistan');

INSERT INTO books (title, isbn, author_id, price, published_year, in_stock) VALUES
    ('1984',               '978-0451524935', 1, 9.99,  1949, TRUE),
    ('Animal Farm',        '978-0451526342', 1, 7.50,  1945, TRUE),
    ('Things Fall Apart',  '978-0385474542', 2, 12.00, 1958, TRUE),
    ('Raja Gidh',          '978-9690000001', 3, 15.00, 1981, FALSE);
