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

---

## 🧮 Simple Calculator Application

A beautiful, modern calculator web application with dark theme, full keyboard support, calculation history, and copy-to-clipboard functionality.

**[🚀 Try it now!](https://anilkumarputta.github.io/SmartCalc/)**

### Core Features
- **Basic Operations**: Addition (+), Subtraction (-), Multiplication (×), Division (÷)
- **Advanced Functions**: Percentage (%), Clear (C), Delete/Backspace (DEL)
- **Keyboard Support**: Full keyboard navigation and input
  - Numbers: 0-9
  - Operators: +, -, *, /
  - Percentage: %
  - Equals: Enter or =
  - Clear: Escape or C
  - Delete: Backspace
- **Error Handling**: Division by zero protection, decimal point validation
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- **Modern UI**: Dark theme with smooth animations and hover effects

### Enhanced Features ✨
- **📋 Copy Result Button**: 
  - One-click clipboard copy with visual feedback
  - Shows "✓ Copied!" confirmation
  - Keyboard shortcut: Ctrl/Cmd + C
  
- **📜 Calculation History Panel**: 
  - Automatically tracks last 20 calculations
  - Click any history item to reuse the result
  - "Clear All" button to reset history
  - Side-by-side layout on desktop, stacked on mobile
  - Beautiful scrollable design with custom styling
  
- **🏷️ SEO & Social Sharing**:
  - Complete Open Graph tags for social media sharing
  - Twitter Card support
  - SEO-optimized meta description and keywords
  - Custom calculator favicon (🧮 emoji)

### Usage
Simply open `calculator.html` in any modern web browser. No installation or dependencies required!

Or try it live: **[https://anilkumarputta.github.io/SmartCalc/](https://anilkumarputta.github.io/SmartCalc/)**

### Calculator Features Tested
- ✅ Basic arithmetic: 5 + 3 = 8
- ✅ Decimals: 5.5 + 2.3 = 7.8
- ✅ Negative numbers: 3 - 5.5 = -2.5
- ✅ Division by zero: Shows "Error"
- ✅ Percentage: 50% = 0.5
- ✅ Keyboard input: Full keyboard support
- ✅ Delete function: Remove last digit
- ✅ Clear function: Reset calculator
- ✅ Copy button: Clipboard copy with feedback
- ✅ History tracking: All calculations saved
- ✅ History interaction: Click to reuse results
- ✅ Responsive design: Works on all screen sizes

### Screenshots

**Original Calculator**

**Desktop View** - Modern dark theme with purple gradient background

<img src="https://github.com/user-attachments/assets/47d90ae1-973c-4156-8db8-8907b5c013f6" alt="Calculator Desktop View" width="400">

**Mobile View** - Fully responsive, adapts to smaller screens (375×667)

<img src="https://github.com/user-attachments/assets/26c464bf-379f-47af-bb71-ed99ebe63400" alt="Calculator Mobile View" width="250">

**Error Handling** - Shows "Error" for invalid operations (division by zero)

<img src="https://github.com/user-attachments/assets/e9bfea5b-daa4-4442-abeb-4b1cac6fb1d7" alt="Calculator Error State" width="400">

**Enhanced Features**

**Desktop with History Panel** - Side-by-side layout showing calculator and calculation history

<img src="https://github.com/user-attachments/assets/16b50e81-b46f-4065-ba5f-1ef73a92d38e" alt="Calculator with History Panel" width="600">

**Multiple Calculations** - History tracks all your calculations with expression and result

<img src="https://github.com/user-attachments/assets/7d29f709-fe78-44a0-8a1f-00b9be8fe56e" alt="Multiple Calculations in History" width="600">

**Mobile Responsive** - All features work perfectly on mobile devices

<img src="https://github.com/user-attachments/assets/f5df18b7-b24c-4a52-94f3-a3251978a5ef" alt="Mobile Responsive Layout" width="300">

### Technical Highlights
- **Pure HTML/CSS/JavaScript** - No frameworks or dependencies
- **Single file** - Everything embedded in `calculator.html`
- **Modern JavaScript** - ES6+ class-based architecture
- **Responsive CSS Grid** - Beautiful button layout
- **Local Storage Ready** - History can be persisted (future enhancement)
- **Accessibility** - Keyboard navigation support
- **Performance** - Lightweight and fast (< 20KB total)
