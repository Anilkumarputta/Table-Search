<img width="160" height="40" alt="image" src="https://github.com/user-attachments/assets/29aa872b-8d36-4569-af9f-57c48c2e8d5e" />
  ##Table Search

Professional search cockpit with server full-text search (FTS), fuzzy matching, analytics, and profile tools.


Table of contents
- [About](#about)
- [Screenshots](#screenshots)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Prerequisites](#prerequisites)
- [Run locally](#run-locally)
  - [Single-repo / monolith](#single-repo--monolith)
  - [Frontend / Backend split (common)](#frontend--backend-split-common)
- [Configuration (.env example)](#configuration-env-example)
- [Usage / UI guide](#usage--ui-guide)
- [Development tips](#development-tips)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

## About

Table Search is a data discovery workspace UI for searching, exploring, and previewing profile records from tabular data sources. It supports server-side full-text search (FTS), fuzzy matching, filtering, saved views, keyboard shortcuts, and dark/light themes for comfortable analysis.

## Screenshots

> Place the three screenshot files in `assets/screenshots/` as described above. The markdown below references those files.

Light theme — main listing
![Light theme - full view]<img width="1440" height="2000" alt="image" src="https://github.com/user-attachments/assets/672f1eb7-767f-40aa-b8fa-842e92facb5b" />


Light theme — single result & profile details
![Light theme - result detail]<img width="1440" height="2000" alt="image" src="https://github.com/user-attachments/assets/2ce0b716-f521-46da-ae5a-71707304357c" />


Dark theme
![Dark theme]<img width="1440" height="2000" alt="image" src="https://github.com/user-attachments/assets/e6c73056-aba1-43e8-ab62-311366cbed9a" />


## Features

- Server full-text search (FTS) mode and fuzzy search mode
- Filterable results (country, story presence, recently viewed)
- Saved views, sorting and pagination controls
- Profile preview panel with Overview / Story / Activity tabs
- Keyboard shortcuts:
  - `/` or focus shortcut to jump to search field
  - `Enter` to submit search
  - `Esc` to clear
  - `Shift+F` to enter fuzzy-search mode
- Dark and light themes
- Simple REST API for records and authentication

## API Endpoints (examples)

The project exposes simple REST endpoints used by the UI. Replace `http://localhost:3000` with the host you run locally.

- List (paged) search results
  - GET /api/users
  - Example:
    ```
    curl -X GET "http://localhost:3000/api/users"
    ```

- Get all users (non-paged)
  - GET /api/users/all
  - Example:
    ```
    curl -X GET "http://localhost:3000/api/users/all"
    ```

- Get user by id
  - GET /api/users/:id
  - Example:
    ```
    curl -X GET "http://localhost:3000/api/users/1"
    ```

- Login (returns auth token)
  - POST /api/login
  - Example:
    ```
    curl -X POST "http://localhost:3000/api/login" \
      -H "Content-Type: application/json" \
      -d '{"username":"admin","password":"password"}'
    ```

- Update user by id
  - PUT /api/users/:id
  - Example:
    ```
    curl -X PUT "http://localhost:3000/api/users/1" \
      -H "Content-Type: application/json" \
      -d '{"name":"Anil","city":"Texas"}'
    ```

> Note: These are example endpoints recorded from the UI. The exact auth flow, headers (e.g. Authorization), and payloads depend on the repository implementation.

## Prerequisites

- Git
- Node.js (recommended LTS, e.g., 18.x or 20.x) — adjust to project requirements if different
- npm or yarn
- If the project uses a database, ensure the DB server is running and reachable (see `.env` vars below)
- Optional: Docker (if there is a docker-compose / container setup)

## Run locally

Below are two common setups — single-repo monolithic projects and separated frontend/backend. Use the one that fits this repository.

### Single-repo / monolith

1. Clone repository
   ```
   git clone https://github.com/Anilkumarputta/Table-Search.git
   cd Table-Search
   ```

2. Create environment file
   ```
   cp .env.example .env
   # Edit .env to set DB, FTS endpoint, JWT secret, and port as needed
   ```

3. Install dependencies
   ```
   npm install
   ```

4. Run development server
   ```
   npm run dev
   ```
   Or, to build and start:
   ```
   npm run build
   npm start
   ```

5. Open browser
   - Visit: http://localhost:3000 (or the PORT set in `.env`)

### Frontend / Backend split (common)

If the repo has `client/` and `server/` directories:

1. Start the backend
   ```
   cd server
   cp .env.example .env
   npm install
   npm run dev   # or npm start
   ```

2. Start the frontend
   ```
   cd ../client
   cp .env.example .env
   npm install
   npm run dev   # typically starts on http://localhost:3000 or 5173
   ```

3. Open the frontend URL shown in terminal.

## Configuration (.env example)

Create a `.env` at project root (or per service) with variables like:

```
# .env.example
PORT=3000
NODE_ENV=development

# Authentication
JWT_SECRET=replace-with-a-secret

# Database
DATABASE_URL=postgres://user:pass@localhost:5432/dbname

# Search / FTS server (if separate)
FTS_SERVER_URL=http://localhost:9200

# Optional
LOG_LEVEL=info
```

Adjust variable names to match the repository's configuration.

## Usage / UI guide

- Search box: type a name, city, country, or story fragment and press Enter.
- Server Search: runs the server-side FTS query (accurate, exact)
- Fuzzy Search: allows approximate matches (useful for typos)
- Filters: click country tags (USA, India), Has Story, Recently Viewed
- Saved views: create and recall custom filter+sort presets
- Sorting and Page size controls: use to refine result order and paging
- Profile preview: click a result to view full profile; use tabs for Overview / Story / Activity
- Keyboard shortcuts: use `/` to focus search, `Enter` to search, `Esc` to clear

## Development tips

- Use your browser DevTools to inspect API requests to /api/* endpoints to understand expected payloads.
- If the workspace supports hot reload, edits to UI code should auto-update.
- If a separate search server (e.g. ElasticSearch) is required, ensure it is seeded with expected index mappings and sample data.

## Contributing

Contributions are welcome. A minimal workflow:

1. Fork the repo
2. Create a topic branch: `git checkout -b feat/add-readme`
3. Commit changes and push: `git push origin feat/add-readme`
4. Open a Pull Request against `main` (or repo default branch)

Add tests for bug fixes and new features where appropriate.

## License

This project is licensed under the MIT License — see [LICENSE](./LICENSE) for details.

## Credits

- UI screenshots: provided by the project owner
- Created by: Anilkumarputta
