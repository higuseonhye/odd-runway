# Runway

Web app for **US-market** startup founders: model **cash runway, burn, and investor rhythms** in one place (USD). Core flows run in the browser; **optional Supabase** adds sign-in and cloud sync.

**Stack:** Vite 5 · React 18 · TypeScript · Tailwind · Papa Parse · SheetJS (`xlsx`) · Supabase (optional auth + DB).

---

## Features

| Area | What it does |
|------|----------------|
| Runway model | Cash, gross burn, MRR-style revenue, MoM growth → net burn, runway, breakeven, 12‑month chart |
| Presets | Seed / Series A / High growth |
| Import | CSV or Excel (first sheet) → inferred burn, revenue, ending balance when present |
| Crisis playbook | Actions + copy tiered by computed runway (months) |
| Hygiene | Monthly / quarterly deadline checklist |
| Data | **localStorage** always; **Supabase** sync after email sign-in (magic link or password) |

---

## Diagrams

Illustrative SVGs. Swap in PNG/WebP under `docs/images/` if you want real screenshots.

<p align="center">
  <img src="./docs/images/demo-overview.svg" alt="Product flow" width="720" />
</p>

<p align="center">
  <img src="./docs/images/architecture.svg" alt="Architecture" width="720" />
</p>

---

## Getting started

```bash
npm install
npm run dev
```

Open the printed URL (usually `http://localhost:5173`). **No backend required** for sliders, CSV import, and crisis copy.

```bash
npm run build
npm run preview
```

Deploy **`dist/`** to Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

**Smoke test:** Download **sample.csv** / **sample.xlsx** in the app → upload → **Apply to model**.

---

## CI

GitHub Actions runs `npm ci` and `npm run build` on push/PR to `main` / `master` (see `.github/workflows/ci.yml`).

---

## Sample data

| File | Role |
|------|------|
| `public/sample-runway-transactions.csv` | Demo transactions (USD) |
| `public/sample-runway-transactions.xlsx` | Same data for Excel tests |

```bash
npm run generate:sample   # rebuild .xlsx from CSV after edits
```

---

## Supabase (sign-in + sync)

1. Create a project at [supabase.com](https://supabase.com).
2. **Authentication → URL configuration:** set **Site URL** to your app origin (e.g. `http://localhost:5173` for dev, production URL when deployed). Add the same to **Redirect URLs** if needed.
3. **Authentication → Providers:** ensure **Email** is enabled (default).
4. In the SQL editor, run all files in `supabase/migrations/` in order (`user_finance`, then `profiles`).
5. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

Restart the dev server. Use **Sign in** in the header: magic link or email + password. Synced runway values live in `user_finance`; `profiles` stores a row per user.

Without `.env`, the app works offline-only (no Sign in button).

---

## Product roadmap (beyond this repo)

| Phase | Ideas |
|-------|--------|
| **Now** | Deployed static URL, real screenshots, small UX polish |
| **Integrations** | Plaid / Stripe / QuickBooks read-only connections |
| **Comms** | Investor update emails (e.g. Resend + React Email) |
| **Team** | Org accounts, roles, audit trail |

---

## Disclaimer

Educational / prototype use only. Not financial, legal, or investment advice.

---

## License

[MIT](./LICENSE). `package.json` sets `"private": true` so `npm publish` is blocked by default.
