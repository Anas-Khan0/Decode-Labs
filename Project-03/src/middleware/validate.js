// ============================================================
//  Lightweight validation helpers (no external libs).
//  Validates request bodies BEFORE they reach the database,
//  so the API returns friendly 400s instead of relying only
//  on DB constraints to reject bad data.
// ============================================================
import { badRequest } from './errorHandler.js';

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---- Authors ----
export function validateAuthor(body, { partial = false } = {}) {
  const data = {};

  if (!partial || body.name !== undefined) {
    if (!isNonEmptyString(body.name)) throw badRequest('`name` is required and must be a non-empty string.');
    data.name = body.name.trim();
  }
  if (!partial || body.email !== undefined) {
    if (!isNonEmptyString(body.email) || !emailRegex.test(body.email)) {
      throw badRequest('`email` is required and must be a valid email address.');
    }
    data.email = body.email.trim().toLowerCase();
  }
  if (body.country !== undefined) {
    if (body.country !== null && typeof body.country !== 'string') throw badRequest('`country` must be a string.');
    data.country = body.country;
  }

  if (Object.keys(data).length === 0) throw badRequest('No valid fields provided.');
  return data;
}

// ---- Books ----
export function validateBook(body, { partial = false } = {}) {
  const data = {};

  if (!partial || body.title !== undefined) {
    if (!isNonEmptyString(body.title)) throw badRequest('`title` is required and must be a non-empty string.');
    data.title = body.title.trim();
  }
  if (!partial || body.isbn !== undefined) {
    if (!isNonEmptyString(body.isbn)) throw badRequest('`isbn` is required and must be a non-empty string.');
    data.isbn = body.isbn.trim();
  }
  if (!partial || body.author_id !== undefined) {
    const id = Number(body.author_id);
    if (!Number.isInteger(id) || id <= 0) throw badRequest('`author_id` is required and must be a positive integer.');
    data.author_id = id;
  }
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (Number.isNaN(price) || price < 0) throw badRequest('`price` must be a number >= 0.');
    data.price = price;
  }
  if (body.published_year !== undefined && body.published_year !== null) {
    const year = Number(body.published_year);
    if (!Number.isInteger(year) || year < 1450 || year > 2100) {
      throw badRequest('`published_year` must be an integer between 1450 and 2100.');
    }
    data.published_year = year;
  }
  if (body.in_stock !== undefined) {
    if (typeof body.in_stock !== 'boolean') throw badRequest('`in_stock` must be a boolean.');
    data.in_stock = body.in_stock;
  }

  if (Object.keys(data).length === 0) throw badRequest('No valid fields provided.');
  return data;
}
