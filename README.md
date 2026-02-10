# Table Search — Fullstack (FTS, fuzzy, edit, avatars)

This repo is a compact full‑stack demo: an Express + SQLite backend and a static frontend in `public/`.
It demonstrates:
- Server-side full-text search (SQLite FTS5) across `name` + `story`
- Client-side fuzzy search via Fuse.js (toggle)
- Paginated list, server-side sorting
- Story preview, modal detail, and edit flow (admin)
- Simple admin token auth (in-memory token store for demo)
- Dockerfile + docker-compose for local container runs

Requirements
- Node.js 18.x (recommended)
- npm
- For native builds of `better-sqlite3` on Windows: Visual Studio "Desktop development with C++" workload or Windows Build Tools. Use Docker on Windows to avoid native build issues.

Quick start — local
```bash
# Install dependencies
npm install

# Initialize the SQLite DB and seed sample data
npm run init-db

# Start the server (unix/mac)
ADMIN_PASSWORD="yourpass" npm start

# Windows PowerShell
$env:ADMIN_PASSWORD='yourpass'; npm start

# Windows cmd.exe
set ADMIN_PASSWORD=yourpass && npm start
```

Open:
http://localhost:3000

Quick start — Docker (recommended for Windows)
```bash
docker-compose build --pull
docker-compose up --detach
# open http://localhost:3000/
```

To stop and remove containers:
```bash
docker-compose down
```

Notes
- If `data.db` does not exist, run `npm run init-db` to create and seed it.
- `docker-compose.yml` mounts `./data.db` into the container so your seeded DB persists on the host.
- Ensure SQLite is built with FTS5 support for server-side search.
- The demo uses an in-memory token store (tokens expire after 1 hour). Do NOT use this in production.

Environment variables
- ADMIN_PASSWORD — admin password for `POST /api/login` (default in code: `adminpass`)
- PORT — optional; defaults to `3000`

API Endpoints
- GET /api/users?search=&page=1&limit=10&sort=name&dir=asc
- GET /api/users/all
- GET /api/users/:id
- POST /api/login  { password }  -> returns { token }
- PUT /api/users/:id  (Authorization: Bearer <token>)  { story }

Files of interest
- `server.js` — Express server and API
- `init_db.js` — creates/initializes `data.db` and seeds sample data
- `public/index.html` — demo UI
- `Dockerfile`, `docker-compose.yml` — container setup

Contributing
- Fork the repository and create a branch: `git checkout -b feat/your-feature`
- Keep PRs small and include notes for DB changes; run `npm run init-db` when needed.
- Target `main` as the default branch.

License (MIT)
This project is licensed under the MIT License. The full license text is included below and is also recommended to be placed in a top-level `LICENSE` file.

MIT License

Copyright (c) 2025 Anilkumarputta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
