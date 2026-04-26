# BlockBlog —  Decentralized Blockchain Blog

> Major Project: *A Secure and Transparent Decentralized Blogging System Leveraging Blockchain Technology*

## ✨ Design System

- **iOS Glassmorphism** — frosted glass cards, blur backdrops, soft light theme
- **Smooth animations** — spring physics, staggered reveals, hover lift effects
- **DM Sans + DM Mono** fonts for a clean, premium feel
- **iOS color system** — system blues, greens, reds, oranges
- **Haptic-feel buttons** — scale-on-press, spring bounce
- Fully responsive

---

## 🏗️ Project Structure

```
blockchain-blog-ios/
├── backend/
│   ├── blockchain.py        ← SHA-256, Proof of Work, chain validation
│   ├── app.py               ← Flask REST API
│   └── requirements.txt
└── frontend/
    ├── public/index.html
    └── src/
        ├── App.js            ← Router + Toast config
        ├── index.js
        ├── index.css         ← Full iOS design system
        ├── components/
        │   ├── Navbar.js     ← Blur navbar, search, auth
        │   └── BlockCard.js  ← Animated gradient cards
        ├── pages/
        │   ├── Home.js       ← Hero, animated stats, features
        │   ├── Posts.js      ← All posts grid
        │   ├── PostDetail.js ← Article view + tech details
        │   ├── Write.js      ← Post editor with mining animation
        │   ├── Verify.js     ← Chain verifier + explorer
        │   ├── Login.js      ← Sign in / register
        │   └── Search.js     ← Search results
        └── utils/
            ├── api.js
            └── AuthContext.js
```

---

## 🚀 Run Locally (3 Steps)

### Step 1 — Backend

```bash
cd blockchain-blog-ios/backend

# Create & activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac / Linux

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
# → Running on http://localhost:5000
```

> MongoDB is **optional**. Without it, the app runs in-memory mode automatically.

---

### Step 2 — Frontend

Open a **new terminal**:

```bash
cd blockchain-blog-ios/frontend

npm install
npm start
# → Opens http://localhost:3000
```

---

### Step 3 — Use the App

1. **Register** an account → **Login**
2. Click **Write** → compose a post → hit **⛏️ Mine & Publish**
3. Watch it get mined with SHA-256 Proof of Work
4. Go to **Verify** → click **Verify Entire Chain** → ✅ Chain Intact
5. Browse the **Chain Explorer** to inspect every block's hash

---

## 🌐 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server status |
| POST | `/api/register` | Register user |
| POST | `/api/login` | Login |
| GET | `/api/posts` | All posts |
| POST | `/api/posts` | Create post (mines block) |
| GET | `/api/posts/:index` | Single post |
| GET | `/api/search?q=` | Search posts |
| GET | `/api/blockchain` | Full chain |
| GET | `/api/blockchain/verify` | Verify integrity |
| GET | `/api/blockchain/stats` | Statistics |

---

## ☁️ Deploy Free

### Backend → Render.com
1. Push to GitHub
2. New Web Service → connect repo → root: `backend/`
3. Build: `pip install -r requirements.txt`
4. Start: `python app.py`
5. Add env var: `MONGO_URI=<MongoDB Atlas URI>`

### Frontend → Vercel
1. New Project → connect repo → root: `frontend/`
2. Add env var: `REACT_APP_API_URL=https://your-backend.onrender.com`
3. In `src/utils/api.js` change `baseURL` to your Render URL

### Database → MongoDB Atlas (free)
1. mongodb.com/atlas → free M0 cluster
2. Get connection string → use as `MONGO_URI`

---

## ⛏️ Blockchain Internals

| Concept | Implementation |
|---------|---------------|
| Hashing | Python `hashlib.sha256` |
| Block linking | Each block stores `previous_hash` |
| Proof of Work | Mine nonce until hash starts with N zeros |
| Tamper detection | Re-hash on verify, mismatch = tampered |
| Immutability | Changing one block breaks all downstream hashes |
| Difficulty | Default 2, configurable in `blockchain.py` |
