// ============================================================
//  Authors Controller — CRUD (Pillar 3: The Action)
//  Every query uses $1, $2 ... placeholders => parameterized,
//  so user input can never be executed as SQL (Pillar 4).
// ============================================================
import { query } from '../config/db.js';
import { validateAuthor } from '../middleware/validate.js';
import { badRequest } from '../middleware/errorHandler.js';

// CREATE  ->  POST /api/authors        (SQL INSERT)
export async function createAuthor(req, res, next) {
  try {
    const { name, email, country = null } = validateAuthor(req.body);
    const { rows } = await query(
      `INSERT INTO authors (name, email, country)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, country]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// READ (all)  ->  GET /api/authors      (SQL SELECT)
// Supports ?search= and basic ?limit=&offset= pagination.
export async function getAuthors(req, res, next) {
  try {
    const { search } = req.query;
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const offset = Number(req.query.offset) || 0;

    let sql = `SELECT * FROM authors`;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` WHERE name ILIKE $${params.length}`;
    }

    params.push(limit, offset);
    sql += ` ORDER BY id ASC LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const { rows } = await query(sql, params);
    res.json({ count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
}

// READ (one)  ->  GET /api/authors/:id
// Returns the author together with their books (the "Many" side).
export async function getAuthorById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw badRequest('Author id must be an integer.');

    const { rows } = await query(`SELECT * FROM authors WHERE id = $1`, [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Author not found.' });

    const books = await query(
      `SELECT id, title, isbn, price, published_year, in_stock
       FROM books WHERE author_id = $1 ORDER BY id ASC`,
      [id]
    );

    res.json({ ...rows[0], books: books.rows });
  } catch (err) {
    next(err);
  }
}

// UPDATE  ->  PUT/PATCH /api/authors/:id   (SQL UPDATE)
// Builds a dynamic SET clause from only the provided fields.
export async function updateAuthor(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw badRequest('Author id must be an integer.');

    const fields = validateAuthor(req.body, { partial: true });

    const keys = Object.keys(fields);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = keys.map((key) => fields[key]);
    values.push(id); // last placeholder is the id

    const { rows } = await query(
      `UPDATE authors SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Author not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE  ->  DELETE /api/authors/:id    (SQL DELETE)
export async function deleteAuthor(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw badRequest('Author id must be an integer.');

    const { rows } = await query(`DELETE FROM authors WHERE id = $1 RETURNING id`, [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Author not found.' });

    res.json({ message: `Author ${id} deleted (and their books via ON DELETE CASCADE).` });
  } catch (err) {
    next(err);
  }
}
