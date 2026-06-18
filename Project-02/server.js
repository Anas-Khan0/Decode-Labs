// src/server.js
// Project 2: Backend API Development
// A simple REST API for "users" with GET + POST endpoints,
// input validation and proper HTTP status codes.

const express = require("express");
const { getAllUsers, getUserById, addUser } = require("./data");
const { validateUser } = require("./validation");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
// Parse JSON request bodies (so we can read req.body on POST requests)
app.use(express.json());

// Simple request logger (helps you see what's hitting your API)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.url}`);
  next();
});

// --- Health check ---
// GET /  -> confirms the server is alive
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "Users API is running 🚀" });
});

// --- READ all users ---
// GET /users -> 200 OK with the list
app.get("/users", (req, res) => {
  res.status(200).json({ count: getAllUsers().length, data: getAllUsers() });
});

// --- READ a single user ---
// GET /users/:id -> 200 OK, or 404 Not Found if the id doesn't exist
app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);

  // syntactic check: the id in the URL must be a number
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Bad Request", message: "id must be a number." });
  }

  const user = getUserById(id);
  if (!user) {
    return res.status(404).json({ error: "Not Found", message: `No user with id ${id}.` });
  }

  res.status(200).json({ data: user });
});

// --- CREATE a user ---
// POST /users -> 201 Created on success, or 400 Bad Request if validation fails
app.post("/users", (req, res) => {
  const errors = validateUser(req.body);

  // The Gatekeeper Rule: reject malformed data before it touches the data store
  if (errors.length > 0) {
    return res.status(400).json({ error: "Bad Request", messages: errors });
  }

  const newUser = addUser(req.body);
  res.status(201).json({ message: "User created.", data: newUser });
});

// --- 404 handler for any unknown route ---
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", message: `Route ${req.method} ${req.url} does not exist.` });
});

// --- Global error handler -> 500 Internal Server Error ---
// Catches anything unexpected (e.g. invalid JSON in the request body)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error", message: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app; // exported for testing
