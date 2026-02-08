# Table Search Fullstack Example

This repository is a compact full‑stack demo showing:

- Server-side full-text search using SQLite FTS5
- Client-side fuzzy search as a fallback (or for richer local exploration)
- Paginated user list with inline previews and avatars
- View and edit user "stories" protected by a simple admin token

Backend: `server.js` (Express + better-sqlite3) exposes these endpoints:

- `GET /api/users` — paginated list; uses FTS when `search` query is present
- `GET /api/users/all` — returns all users (used by client fuzzy search)
- `GET /api/users/:id` — single user with `story` and `photo`
- `POST /api/login` — exchange admin password for a token
- `PUT /api/users/:id` — update a user's `story` (requires `Authorization: Bearer <token>`)

The UI is served from `public/index.html` and demonstrates search, fuzzy search, previews, and an edit flow.

Quick start
```bash
# Install dependencies
npm install

# Initialize the sqlite DB and seed sample data
npm run init-db

# Start the server (unix/mac)
ADMIN_PASSWORD="yourpass" npm start

# Windows (PowerShell)
#$env:ADMIN_PASSWORD='yourpass'; npm start

# Windows (cmd.exe)
set ADMIN_PASSWORD=yourpass && npm start
```

Open http://localhost:3000/ after the server starts.

Notes
- If `data.db` does not exist, run `npm run init-db` to create and seed it.
- The example uses an in-memory token store (for demo only). Tokens expire after 1 hour by default.
- If you run into native build failures for `better-sqlite3` on Windows, install the "Desktop development with C++" workload for Visual Studio or use the Windows Build Tools as described in its installation docs.

Docker (recommended for Windows users)
------------------------------------

You can run the app with Docker to avoid native build issues on Windows. Example using Docker Compose:

```bash
docker-compose build --pull
docker-compose up --detach
# open http://localhost:3000/
```

The `docker-compose.yml` mounts `data.db` from the repository root so your seeded database persists locally. To run with a custom admin password:

```bash
ADMIN_PASSWORD=yourpass docker-compose up --build
```

To stop and remove containers:

```bash
docker-compose down
```

Contributing
- Create a branch for your change (e.g. `git checkout -b fix/readme`).
- Run tests / `npm run init-db` if your change affects the DB.
- Open a pull request targeting `main`.

License
- This project is provided as a minimal demo. No license specified.