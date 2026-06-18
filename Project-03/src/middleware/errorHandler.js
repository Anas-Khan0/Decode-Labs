// ============================================================
//  Error-handling middleware (Pillar 4: proper data handling).
//  Translates known PostgreSQL error codes into clean HTTP
//  responses instead of leaking raw DB errors to the client.
// ============================================================

// Maps common Postgres SQLSTATE codes to HTTP status + message.
const PG_ERRORS = {
  '23505': { status: 409, message: 'A record with this unique value already exists.' }, // unique_violation
  '23503': { status: 400, message: 'Referenced record does not exist (foreign key).' }, // foreign_key_violation
  '23502': { status: 400, message: 'A required field is missing (NOT NULL).' },         // not_null_violation
  '23514': { status: 400, message: 'A value failed a validation rule (CHECK).' },       // check_violation
  '22P02': { status: 400, message: 'Invalid input syntax for one of the fields.' },     // invalid_text_representation
};

export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Express recognizes error middleware by its 4 arguments.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Validation errors thrown by our own code carry a `.status`.
  if (err.status && err.expose) {
    return res.status(err.status).json({ error: err.message });
  }

  const mapped = PG_ERRORS[err.code];
  if (mapped) {
    return res.status(mapped.status).json({ error: mapped.message, detail: err.detail });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({ error: 'Internal server error.' });
}

// Small helper to throw a clean, client-visible validation error.
export function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  err.expose = true;
  return err;
}
