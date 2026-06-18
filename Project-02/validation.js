// src/validation.js
// "The Gatekeeper Rule: Never Trust the Client" (from the deck).
// We check BOTH:
//   1. Syntactic validation  -> is the format correct? (right fields, right types)
//   2. Semantic validation   -> is the logic valid?    (email looks like an email, etc.)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ROLES = ["user", "admin"];

// Returns an array of error messages. Empty array means data is valid.
function validateUser(body) {
  const errors = [];

  // ---- name ----
  if (body.name === undefined || body.name === null) {
    errors.push("'name' is required.");
  } else if (typeof body.name !== "string" || body.name.trim().length < 2) {
    errors.push("'name' must be a string with at least 2 characters.");
  }

  // ---- email ----
  if (body.email === undefined || body.email === null) {
    errors.push("'email' is required.");
  } else if (typeof body.email !== "string" || !EMAIL_REGEX.test(body.email)) {
    errors.push("'email' must be a valid email address.");
  }

  // ---- role (optional, but if present must be valid) ----
  if (body.role !== undefined && !ALLOWED_ROLES.includes(body.role)) {
    errors.push(`'role' must be one of: ${ALLOWED_ROLES.join(", ")}.`);
  }

  return errors;
}

module.exports = { validateUser };
