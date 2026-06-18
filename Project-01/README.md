# DevHub — Curated Web Dev Resources

A responsive, accessible resource hub for front-end developers. Built with pure HTML5, CSS3, and vanilla JavaScript — no frameworks, no build tools, no dependencies.

> **DecodeLabs Project 1** deliverable.

---

## Live Preview

Open `index.html` directly in any modern browser — no server required.

---

## Features

### Core
- **Category filtering** — filter guides by HTML, CSS, JavaScript, or Tools
- **Live search** — real-time search across card titles and descriptions
- **Sort** — reorder cards by title (A→Z, Z→A) or by category
- **Resource modal** — click "Read guide" for an extended description of any guide
- **14 curated guides** across 4 categories

### User Experience
- **Dark mode** — toggle between light and dark themes, preference saved to `localStorage`
- **Bookmark system** — save guides with ♡/♥, bookmarks persist across sessions via `localStorage`, listed in sidebar
- **Toast notifications** — feedback for bookmark, contact, and newsletter actions
- **Animated stats strip** — counters animate in on scroll using Intersection Observer
- **Card entrance animations** — cards fade and slide in as they enter the viewport
- **Back-to-top button** — appears after scrolling 420px, smooth scroll back

### Forms
- **Contact form** — name, email, and message with inline validation
- **Newsletter signup** — email validation with success feedback

### Accessibility
- Semantic HTML5 landmarks (`<header>`, `<main>`, `<article>`, `<aside>`, `<nav>`, `<footer>`)
- ARIA attributes on interactive elements (`aria-expanded`, `aria-modal`, `aria-label`, `aria-live`)
- Skip-to-main-content link
- `focus-visible` keyboard outlines
- `prefers-reduced-motion` disables all transitions and animations

---

## Project Structure

```
Project-01/
├── index.html   — semantic markup, all sections and components
├── style.css    — design tokens, dark mode, responsive layout, component styles
└── script.js    — all interactivity (filter, search, sort, bookmarks, modal, forms)
```

No build step. No `node_modules`. No config files.

---

## Design System

| Token | Value | Role |
|---|---|---|
| `--mocha-mousse` | `#A5856F` | Primary accent |
| `--ethereal-blue` | `#A0D4E0` | Secondary accent |
| `--moonlit-grey` | `#F2F0EA` | Light background |
| `--ink` | `#2E2A26` | Primary text |
| `--ink-soft` | `#5C5650` | Secondary text |

Typography: **Inter** (headings) + **Open Sans** (body) via Google Fonts.

Semantic tokens (`--bg`, `--surface`, `--text-primary`, `--text-secondary`, `--border`) are layered on top and override for dark mode via `[data-theme="dark"]` on the `<html>` element.

---

## Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| Default (mobile-first) | Single column, hamburger menu |
| `768px+` | Horizontal nav, 2-column card grid |
| `1024px+` | Sticky sidebar + 3-column card grid |

---

## JavaScript Architecture

All interactivity is vanilla ES6+. State is kept in module-level variables:

```
activeFilter   — current category ('all' | 'html' | 'css' | 'js' | 'tools')
searchQuery    — current search string
activeSort     — current sort order ('default' | 'az' | 'za' | 'category')
bookmarks      — array of { id, title } objects, mirrored to localStorage
currentModalId — id of the currently open modal card (null if closed)
```

A single `applyFilters()` function reads all three state variables and drives card visibility. `applySorting()` reorders cards in the DOM before filters run.

---

## Browser Support

Requires a modern browser with support for:
- CSS Grid and Custom Properties
- ES6+ (arrow functions, template literals, destructuring, optional chaining)
- `IntersectionObserver`
- `localStorage`

No polyfills are included.

---

## Getting Started

```bash
# Clone or download the repo, then:
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

Or drag `index.html` into any browser window.

---

## Author

Built by **Muhammad Anas** for the DecodeLabs internship programme, 2026.
