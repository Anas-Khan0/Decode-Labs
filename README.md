# Decode Labs

Three progressive projects built during the Decode Labs internship.

---

## Project 01 — DevHub (Frontend Resource Hub)

A responsive, client-side web app that curates web development resources for front-end developers.

**Stack:** HTML, CSS, Vanilla JavaScript

**Features:**
- Browse and filter curated dev resources
- Light/dark theme toggle
- Back-to-top button and toast notifications

**Run:** Open `Project-01/index.html` in a browser.

---

## Project 02 — Users REST API

A simple Node.js/Express backend with GET and POST endpoints for managing users, including input validation and proper HTTP status codes.

**Stack:** Node.js, Express

**Run:**
```bash
cd Project-02
npm install
npm run dev
```

---

## Project 03 — Book Library API

A full CRUD REST API for a book library (Authors → Books, one-to-many) backed by PostgreSQL.

**Stack:** Node.js, Express, PostgreSQL

**Setup:**
```bash
cd Project-03
npm install
cp .env.example .env   # fill in your DB credentials
npm run db:setup       # create tables
npm run dev
```

---

**Author:** Muhammad Anas
