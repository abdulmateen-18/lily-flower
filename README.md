# 🌸 lily gift

A deeply personal, romantic lily bloom — built as a digital gift.

---

## ▶️ Run Locally (localhost:3000)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server — opens automatically at http://localhost:3000
npm run dev
```

That's it. The page opens in your browser, flower blooms automatically.

---

## 🌐 Deploy to Vercel

**Option A — Vercel CLI**
```bash
npm install -g vercel
vercel
# Follow prompts — it reads vercel.json automatically
```

**Option B — Vercel Dashboard**
1. Push this folder to a GitHub repo
2. Go to https://vercel.com → New Project → Import repo
3. Vercel auto-detects the config — click Deploy

---

## 📁 File Structure

```
lily-gift/
├── index.html        # Markup + SVG lily structure
├── styles.css        # All styling, animations, bloom keyframes
├── script.ts         # TypeScript source (for editing)
├── script.js         # Compiled JS — this is what runs in browser
├── vite.config.js    # Vite dev server config (port 3000)
├── package.json      # npm scripts
├── tsconfig.json     # TypeScript config
├── vercel.json       # Vercel deployment config
└── README.md
```

---

## ✏️ If you edit script.ts

If you want to modify the TypeScript source and recompile:

```bash
# Install ts globally if needed
npm install -g typescript

# Compile TS → JS
npx tsc --noEmit false --module commonjs --outDir . script.ts

# Or just edit script.js directly — it's fully commented
```

---

## ✨ Features

- 🌸 SVG lily with 6 petals, stamens, speckles, veins
- 🌷 Staggered petal bloom on page load
- 💫 Floating light particle background
- 🖱️ Mouse parallax — flower follows your cursor softly
- 💓 Breathing glow pulse after full bloom
- 🔁 Full re-bloom when you return to the tab
- 📱 Mobile responsive + touch parallax
- 🚀 One command to run, one command to deploy