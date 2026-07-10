# Divine Collections 🌿

Product catalogue website for Divine Collections general store.
Customers browse products and are redirected to WhatsApp to purchase.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Search | Fuse.js (fuzzy search) |
| Styling | CSS Modules + CSS Variables |
| Hosting | Vercel (free) |
| Database (Phase 2) | Firebase Firestore |
| Auth (Phase 2) | Firebase Authentication |

## Project Structure

```
divine-collections/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.jsx / Header.module.css
│   │   ├── Hero.jsx / Hero.module.css
│   │   ├── FilterBar.jsx / FilterBar.module.css
│   │   ├── ProductCard.jsx / ProductCard.module.css
│   │   └── AuthModal.jsx / AuthModal.module.css
│   ├── data/
│   │   └── products.js         ← product data (moves to Firebase in Phase 2)
│   ├── utils/
│   │   └── constants.js        ← WhatsApp number, Fuse config, sort options
│   ├── styles/
│   │   └── global.css          ← design tokens, resets
│   ├── App.jsx                 ← root component, all state lives here
│   ├── App.module.css
│   └── index.js
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm start
```
Opens at `http://localhost:3000`

### 3. Build for production
```bash
npm run build
```

## Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Framework: **Create React App** (auto-detected)
5. Click Deploy — done ✅

## Phase 2 Roadmap

- [ ] Firebase Firestore — live product database
- [ ] Firebase Authentication — real login/register
- [ ] Admin panel — uncle can add/edit products via form
- [ ] Firebase Analytics — track product views and WhatsApp clicks
- [ ] Custom domain (e.g. divinecollections.in)
- [ ] Payment gateway (Razorpay)
- [ ] Product reviews and ratings
- [ ] Back-in-stock notifications
