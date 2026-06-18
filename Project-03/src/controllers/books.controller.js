// ============================================================
//  Books Controller — CRUD (Pillar 3: The Action)
//  Demonstrates a JOIN to pull author info alongside each book.
// ============================================================
import { query } from '../config/db.js';
import { validateBook } from '../middleware/validate.js';
import { badRequest } from '../middleware/errorHandler.js';

// CREATE  ->  POST /api/books            (SQL INSERT)
export async function createBook(req, res, next) {
  try {
    const {
      title,
      isbn,
      author_id,
      price = 0,
      published_year = null,
      in_stock = true,
    } = validateBook(req.body);

    const { rows } = await query(
      `INSERT INTO books (title, isbn, author_id, price, published_year, in_stock)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, isbn, author_id, price, published_year, in_stock]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// READ (all)  ->  GET /api/books         (SQL SELECT + JOIN)
// Filters: ?author_id=  ?in_stock=true/false  ?search=  +  pagination
export async function getBooks(req, res, next) {
  try {
    const { author_id, in_stock, search } = req.query;
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const offset = Number(req.query.offset) || 0;

    const conditions = [];
    const params = [];

    if (author_id) {
      params.push(Number(author_id));
      conditions.push(`b.author_id = $${params.length}`);
    }
    if (in_stock === 'true' || in_stock === 'false') {
      params.push(in_stock === 'true');
      conditions.push(`b.in_stock = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`b.title ILIKE $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(limit, offset);

    const sql = `
      SELECT b.*, a.name AS author_name, a.email AS author_email
      FROM books b
      JOIN authors a ON a.id = b.author_id
      ${where}
      ORDER BY b.id ASC
      LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const { rows } = await query(sql, params);
    res.json({ count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
}

// READ (one)  ->  GET /api/books/:id
export async function getBookById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw badRequest('Book id must be an integer.');

    const { rows } = await query(
      `SELECT b.*, a.name AS author_name, a.email AS author_email
       FROM books b
       JOIN authors a ON a.id = b.author_id
       WHERE b.id = $1`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Book not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// UPDATE  ->  PUT/PATCH /api/books/:id   (SQL UPDATE)
export async function updateBook(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw badRequest('Book id must be an integer.');

    const fields = validateBook(req.body, { partial: true });

    const keys = Object.keys(fields);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = keys.map((key) => fields[key]);
    values.push(id);

    const { rows } = await query(
      `UPDATE books SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Book not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE  ->  DELETE /api/books/:id      (SQL DELETE)
export async function deleteBook(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw badRequest('Book id must be an integer.');

    const { rows } = await query(`DELETE FROM books WHERE id = $1 RETURNING id`, [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Book not found.' });

    res.json({ message: `Book ${id} deleted.` });
  } catch (err) {
    next(err);
  }
}
