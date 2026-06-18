# Project 2 — Backend API Development (Users API)

A simple REST API built with **Node.js + Express**. It exposes `GET` and `POST`
endpoints to manage users, validates incoming data, and returns proper HTTP
status codes — covering all the requirements from the DecodeLabs Project 2 brief.

## Requirements covered
- ✅ API endpoints (GET / POST)
- ✅ Handle user input and responses (JSON)
- ✅ Validate basic data ("Never Trust the Client")
- ✅ Proper status codes (200, 201, 400, 404, 500)
- ✅ RESTful naming (resources are nouns: `/users`)

## Setup

```bash
npm install
npm start
```

Server runs on `http://localhost:3000`.
(Use `npm run dev` to auto-restart on file changes.)

## Endpoints

| Method | Route         | Description            | Success | Error          |
|--------|---------------|------------------------|---------|----------------|
| GET    | `/`           | Health check           | 200     | —              |
| GET    | `/users`      | Get all users          | 200     | —              |
| GET    | `/users/:id`  | Get one user by id     | 200     | 400 / 404      |
| POST   | `/users`      | Create a new user      | 201     | 400            |

## Sample requests

Get all users:
```bash
curl http://localhost:3000/users
```

Get one user:
```bash
curl http://localhost:3000/users/1
```

Create a user (valid → 201 Created):
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Anas","email":"anas@example.com","role":"admin"}'
```

Create a user (invalid → 400 Bad Request):
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"A","email":"not-an-email"}'
```

## Validation rules
- `name` — required, string, at least 2 characters
- `email` — required, must be a valid email format
- `role` — optional, must be `user` or `admin`

## Project structure
```
backend-api/
├── package.json
├── README.md
└── src/
    ├── server.js      # Express app + routes + error handling
    ├── data.js        # In-memory data store
    └── validation.js  # Input validation (the "Gatekeeper Rule")
```

> Note: Data is stored **in memory**, so it resets when the server restarts.
> This is intentional — the brief says "before you scale into complex databases."
> The next step would be swapping `data.js` for PostgreSQL or MongoDB.
