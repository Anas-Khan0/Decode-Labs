# 📚 Book Library API — Database Integration (Project 3)

A **Node.js + Express + PostgreSQL** REST API demonstrating database
integration with full **CRUD** operations, schema design, relationships,
and secure data handling.

Built with the **native `pg` driver** (no ORM) and **parameterized queries**,
so it directly demonstrates every pillar from the Project 3 kit:

| Pillar | Concept | Where it lives |
| --- | --- | --- |
| 1 — Blueprint | Schema, PK, FK, constraints | `db/schema.sql` |
| 2 — Bridge | Native driver connection pool | `src/config/db.js` |
| 3 — Action | CRUD ↔ REST ↔ SQL | `src/controllers/*` |
| 4 — Shield | Constraints + parameterized queries | schema + every query |

---

## 🗂 Data Model

A classic **one-to-many** relationship:

```
authors (1) ──────< books (Many)
```

**authors**: `id` (PK), `name` (NOT NULL), `email` (UNIQUE, NOT NULL), `country`
**books**: `id` (PK), `title`, `isbn` (UNIQUE), `author_id` (FK → authors.id),
`price` (CHECK ≥ 0), `published_year` (CHECK range), `in_stock`

Deleting an author cascades to their books (`ON DELETE CASCADE`).

---

## ⚙️ Setup

### 1. Prerequisites
- Node.js 18+
- A running PostgreSQL instance

### 2. Install
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and set your `DATABASE_URL` (or the individual `PG*` vars).

Create the database first if it doesn't exist:
```bash
createdb book_library          # or: CREATE DATABASE book_library; inside psql
```

### 4. Create tables + seed data
```bash
npm run db:setup
```
This runs `db/schema.sql` (tables, constraints, and a few starter rows).

### 5. Run the server
```bash
npm run dev      # auto-reload (Node --watch)
# or
npm start
```
Server boots at **http://localhost:4000**

---

## 🔌 Endpoints

REST verb → SQL action mapping:

| Method | Path | Action | SQL |
| --- | --- | --- | --- |
| POST | `/api/authors` | Create | INSERT |
| GET | `/api/authors` | Read all | SELECT |
| GET | `/api/authors/:id` | Read one (+ their books) | SELECT |
| PUT/PATCH | `/api/authors/:id` | Update | UPDATE |
| DELETE | `/api/authors/:id` | Delete | DELETE |
| POST | `/api/books` | Create | INSERT |
| GET | `/api/books` | Read all (+ author via JOIN) | SELECT |
| GET | `/api/books/:id` | Read one | SELECT |
| PUT/PATCH | `/api/books/:id` | Update | UPDATE |
| DELETE | `/api/books/:id` | Delete | DELETE |

**Query params** on `GET /api/books`: `?author_id=`, `?in_stock=true|false`,
`?search=`, `?limit=`, `?offset=`.
On `GET /api/authors`: `?search=`, `?limit=`, `?offset=`.

---

## 🧪 Try it (curl)

```bash
# Create an author
curl -X POST http://localhost:4000/api/authors \
  -H "Content-Type: application/json" \
  -d '{"name":"J.R.R. Tolkien","email":"tolkien@example.com","country":"UK"}'

# List authors
curl http://localhost:4000/api/authors

# Create a book (use a real author_id from above)
curl -X POST http://localhost:4000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"The Hobbit","isbn":"978-0547928227","author_id":1,"price":14.99,"published_year":1937}'

# List books (with author info joined in)
curl http://localhost:4000/api/books

# Get one author with their books nested
curl http://localhost:4000/api/books?author_id=1

# Update a book (partial)
curl -X PATCH http://localhost:4000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"price":11.50,"in_stock":false}'

# Delete a book
curl -X DELETE http://localhost:4000/api/books/1
```

---

## 🛡 Security & Data Handling

- **Parameterized queries** everywhere (`$1, $2 ...`) — user input is sent as
  data, never executed as SQL, so SQL injection is neutralized.
- **DB-level constraints** (`NOT NULL`, `UNIQUE`, `CHECK`, foreign keys) enforce
  integrity even if the app layer is bypassed — the database is the source of truth.
- **App-level validation** returns friendly `400`s before hitting the DB.
- **Centralized error handler** maps Postgres error codes (e.g. unique violation
  → `409`) to clean HTTP responses instead of leaking raw DB errors.

---

## 📁 Structure

```
book-library-api/
├── db/
│   └── schema.sql              # tables, constraints, seed data
├── scripts/
│   └── setup-db.js             # npm run db:setup
├── src/
│   ├── config/db.js            # pg pool + parameterized query helper
│   ├── controllers/            # CRUD logic
│   │   ├── authors.controller.js
│   │   └── books.controller.js
│   ├── routes/                 # REST -> controller mapping
│   │   ├── authors.routes.js
│   │   └── books.routes.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── app.js                  # express app
│   └── server.js               # entry point
├── .env.example
└── package.json
```
