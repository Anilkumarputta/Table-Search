# Table Search — Fullstack (FTS, fuzzy, edit, avatars)

This repo contains a fullstack example: an Express + SQLite backend and a static frontend in public/.

Features:
- Server-side full-text search (SQLite FTS5) across name + story
- Client-side fuzzy search via Fuse.js (toggle)
- Paginated list, server-side sorting
- Story previews (expand/collapse) and modal view
- Admin login -> token -> edit/save story (PUT /api/users/:id)
- Avatars (seeded via pravatar) and responsive UI
- Dockerfile + docker-compose for local container runs

Quick start (local)
1. Install:
   npm install

2. Initialize DB:
   npm run init-db

3. Start server (set admin password optionally):
   ADMIN_PASSWORD="yourpass" npm start

4. Open:
   http://localhost:3000

API
- GET /api/users?search=&page=1&limit=10&sort=name&dir=asc
- GET /api/users/:id
- GET /api/users/all
- POST /api/login  { password }
- PUT /api/users/:id  (Authorization: Bearer <token>)  { story }

Notes
- For production, replace in-memory tokens with real auth, use Postgres/Elasticsearch for large datasets, and store photos in S3 or similar.
- Ensure SQLite is built with FTS5 support for server-side search.
