/**
 * server.js
 * Express server with:
 * - SQLite (better-sqlite3) persistence
 * - FTS5 full-text search over name+story
 * - /api/users : paginated list (uses FTS5 when search provided)
 * - /api/users/all : returns all users (used by client-side fuzzy search)
 * - /api/users/:id : single user (includes story + photo)
 * - PUT /api/users/:id : update story (authenticated via token)
 * - POST /api/login : simple password -> token (in-memory session)
 *
 * Start:
 *  ADMIN_PASSWORD="yourpass" npm start
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');
const crypto = require('crypto');

const DB_FILE = path.join(__dirname, 'data.db');

if (!fs.existsSync(DB_FILE)) {
  console.warn('Database not found. Please run `npm run init-db` to create and seed the database.');
}

const db = new Database(DB_FILE);
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory session store (token -> { createdAt })
const sessions = new Map();
const TOKEN_TTL_MS = 1000 * 60 * 60; // 1 hour
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpass';

function createToken() {
  return crypto.randomBytes(24).toString('hex');
}
function isValidToken(token) {
  if (!token) return false;
  const s = sessions.get(token);
  if (!s) return false;
  if (Date.now() - s.createdAt > TOKEN_TTL_MS) {
    sessions.delete(token);
    return false;
  }
  return true;
}

function buildFtsQuery(search) {
  const terms = String(search || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return null;
  const q = terms.map(t => `${t}*`).join(' AND ');
  return q;
}

// GET /api/users
app.get('/api/users', (req, res) => {
  try {
    const search = String(req.query.search || '').trim();
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '10', 10)));
    const sort = req.query.sort || 'id';
    const dir = (req.query.dir === 'desc') ? 'DESC' : 'ASC';
    const allowed = new Set(['id', 'name', 'country', 'city']);
    const sortCol = allowed.has(sort) ? sort : 'id';
    const offset = (page - 1) * limit;

    let rows = [];
    let total = 0;

    const ftsQuery = buildFtsQuery(search);

    if (ftsQuery) {
      const countStmt = db.prepare(`
        SELECT COUNT(*) AS cnt
        FROM users_fts f
        JOIN users u ON u.rowid = f.rowid
        WHERE f MATCH ?
      `);
      const totalRow = countStmt.get(ftsQuery);
      total = totalRow ? totalRow.cnt : 0;

      const stmt = db.prepare(`
        SELECT u.id, u.name, u.country, u.city, u.photo
        FROM users_fts f
        JOIN users u ON u.rowid = f.rowid
        WHERE f MATCH ?
        ORDER BY ${sortCol} ${dir}
        LIMIT ? OFFSET ?
      `);
      rows = stmt.all(ftsQuery, limit, offset);
    } else {
      const params = [];
      let where = '';
      if (search) {
        const like = `%${search.toLowerCase()}%`;
        where = 'WHERE lower(id) LIKE ? OR lower(name) LIKE ? OR lower(country) LIKE ? OR lower(city) LIKE ?';
        params.push(like, like, like, like);
      }
      const totalStmt = db.prepare(`SELECT COUNT(*) AS cnt FROM users ${where}`);
      const totalRow = totalStmt.get(...params);
      total = totalRow ? totalRow.cnt : 0;

      const stmt = db.prepare(`
        SELECT id, name, country, city, photo
        FROM users
        ${where}
        ORDER BY ${sortCol} ${dir}
        LIMIT ? OFFSET ?
      `);
      rows = stmt.all(...params, limit, offset);
    }

    res.json({ total, page, limit, results: rows });
  } catch (err) {
    console.error('Error /api/users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/:id
app.get('/api/users/:id', (req, res) => {
  try {
    const id = String(req.params.id || '').trim();
    if (!id) return res.status(400).json({ error: 'Missing id' });
    const stmt = db.prepare('SELECT id, name, country, city, story, photo FROM users WHERE id = ?');
    const row = stmt.get(id);
    if (!row) return res.status(404).json({ error: 'User not found' });
    res.json(row);
  } catch (err) {
    console.error('Error /api/users/:id', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/all
app.get('/api/users/all', (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, name, country, city, story, photo FROM users ORDER BY id ASC');
    const rows = stmt.all();
    res.json(rows);
  } catch (err) {
    console.error('Error /api/users/all', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/login
app.post('/api/login', (req, res) => {
  const password = String(req.body.password || '');
  if (!password) return res.status(400).json({ error: 'Password required' });
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid password' });
  const token = createToken();
  sessions.set(token, { createdAt: Date.now() });
  res.json({ token, expiresIn: TOKEN_TTL_MS });
});

// PUT /api/users/:id (update story) - authenticated
app.put('/api/users/:id', (req, res) => {
  try {
    const auth = String(req.headers['authorization'] || '');
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!isValidToken(token)) return res.status(401).json({ error: 'Unauthorized' });

    const id = String(req.params.id || '').trim();
    if (!id) return res.status(400).json({ error: 'Missing id' });
    const story = typeof req.body.story === 'string' ? req.body.story : null;
    if (story === null) return res.status(400).json({ error: 'Missing story' });

    const update = db.prepare('UPDATE users SET story = ? WHERE id = ?');
    const info = update.run(story, id);
    if (info.changes === 0) return res.status(404).json({ error: 'User not found' });

    // Sync FTS
    const row = db.prepare('SELECT rowid, name, story FROM users WHERE id = ?').get(id);
    if (row) {
      const del = db.prepare('DELETE FROM users_fts WHERE rowid = ?');
      del.run(row.rowid);
      const upsert = db.prepare('INSERT INTO users_fts(rowid, name, story) VALUES(?, ?, ?);');
      upsert.run(row.rowid, row.name, story);
    }

    res.json({ ok: true, id });
  } catch (err) {
    console.error('Error PUT /api/users/:id', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/health', (req, res) => { res.json({ status: 'ok' }); });

// SPA fallback
app.get('*', (req, res) => {
  const index = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(index)) res.sendFile(index);
  else res.status(404).send('Not found');
});

// Cleanup sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, s] of sessions) if (now - s.createdAt > TOKEN_TTL_MS) sessions.delete(token);
}, 1000 * 60 * 5);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
