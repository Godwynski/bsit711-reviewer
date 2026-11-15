# BSIT-711 Pre-Finals Reviewer

Clean terminal TUI web app for BSIT-711 pre-finals review: formatted reviewers, PDF.js handout viewer, Practice & Exam quizzes with Retry-missed loops, Look-alike flip-card drill, Weak spots collector, Ctrl+K command palette, 4 terminal themes, and offline PWA support.

## Scripts

- `npm run sync` — Copy handout PDFs and `Reviewer_*.md` files from local Academics Pre-Finals folder (excluding Euthenics 2) into `content/`.
- `npm run build` — Parse and validate all reviewers, generate `dist/data/`, `dist/manifest.json`, `dist/search-index.json`, `dist/sw.js`, and copy static site to `dist/`.
- `npm test` — Run unit tests (`node --test tests/*.test.mjs`).
- `npm run e2e` — Serve `dist/` and run Playwright Chromium end-to-end checks + capture desktop/mobile screenshots into `screenshots/`.
- `npm run serve` — Serve `dist/` locally on `http://127.0.0.1:4173`.

## Structure

- `content/` — Synced source PDFs and reviewer Markdown files.
- `scripts/` — `sync.mjs`, `parse.mjs`, `build.mjs`, `serve.mjs`.
- `src/` — Static ES modules (`app.js`, `router.js`, `quiz.js`, `drill.js`, `search.js`, `store.js`, `boot.js`, `style.css`, `sw.js`, `index.html`).
- `tests/` — Unit tests (`parse.test.mjs`, `quiz.test.mjs`, `store.test.mjs`) and Playwright E2E (`e2e.spec.mjs`).
- `vercel.json` — Vercel build (`npm run build`), output (`dist`), `noindex` headers, and long-cache rules.
