# Runway

Web app for **US-market** startup founders: model **cash runway, burn, and investor rhythms** in one place (USD). It infers an **operating mode** from your numbers (no confessional onboarding), surfaces a **one-line “silent” insight**, and adds a **Resilience** section oriented to **next moves and execution** — not therapy. It does **not** assume every company survives; it aims to **clarify options** (including orderly exits). Core flows run in the browser; **optional Supabase** adds sign-in and cloud sync; **optional Resend** sends investor-update emails via a tiny Node API.

**Stack:** Vite 5 · React 18 · TypeScript · Tailwind · Papa Parse · SheetJS (`xlsx`) · Supabase (optional) · Express + Resend (optional mail API).

---

## Features

| Area | What it does |
|------|----------------|
| Runway model | Cash, gross burn, MRR-style revenue, MoM growth → net burn, runway, breakeven, 12‑month chart |
| Situation surface | Inferred **mode** (normal → survival) from runway + burn; optional **pressure** toggles (local only) adjust copy — no story required |
| Resilience | **Execution-first**, **outcome-neutral** copy (survival not guaranteed): **when nothing feels possible**, healthy throughput, worst-case horizons, when “conventions” hurt, **after it ends** (post-closure life and loose ends — not modeled here); legal/tax as **paperwork and compliance**, not a substitute for your operating plan |
| Presets | Seed / Series A / High growth |
| Import | CSV or Excel (first sheet) → inferred burn, revenue, ending balance when present |
| Crisis playbook | Actions + copy tiered by computed runway (months) |
| Hygiene | Monthly / quarterly deadline checklist |
| Data | **localStorage** always; **Supabase** sync after email sign-in |
| **Investor email** | Build HTML from current numbers + wins/asks; **Send via Resend** (needs API server + `RESEND_API_KEY`) |

---

## Getting started

```bash
npm install
npm run dev
```

This starts **Vite** (frontend) and the **Express** API (`server/index.mjs` on port **8787**) together. The dev server proxies `/api/*` to the API.

- **Frontend only:** `npm run dev:client`
- **API only:** `npm run dev:server`

```bash
npm run build
npm run preview
```

Deploy **`dist/`** to a static host. For **investor emails in production**, run the API on a host (Railway, Fly, Render, etc.) and set `VITE_API_URL` to that origin so the browser can call it (or put API and SPA behind one reverse proxy).

**Smoke test:** sample CSV → **Apply to model**; sign in → **Investor email** → send a test (after Resend is configured).

---

## Investor emails (Resend)

1. Create an account at [resend.com](https://resend.com) and create an **API key**.
2. For production `from` addresses, **verify a domain** in Resend. For quick tests you can use `Runway <onboarding@resend.dev>` (subject to [Resend test limits](https://resend.com/docs)).
3. Add to `.env` (see `.env.example`):
   - `RESEND_API_KEY`
   - `RESEND_FROM` (optional; defaults to `Runway <onboarding@resend.dev>`)
   - `SUPABASE_URL` / `SUPABASE_ANON_KEY` (or rely on `VITE_SUPABASE_*` — the server reads both)
4. **Sign in** in the app so the API can verify your Supabase session.
5. Open **Investor email**, fill **To** / wins / asks, **Send via Resend**.

The API (`POST /api/investor-update`) checks the `Authorization: Bearer <access_token>` header against Supabase, then sends HTML via Resend.

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
2. **Authentication → URL configuration:** **Site URL** = app origin (`http://localhost:5173` in dev). Add **Redirect URLs** as needed.
3. **Authentication → Providers:** **Email** enabled.
4. Run `supabase/migrations/*.sql` in order in the SQL editor.
5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`, restart `npm run dev`.

Without Supabase env vars, the app works offline-only (no Sign in).

---

## Product roadmap (beyond this repo)

| Phase | Ideas |
|-------|--------|
| **Now** | Deploy static app + API; custom domain on Resend |
| **Integrations** | Plaid / Stripe / QuickBooks |
| **Comms** | Richer templates (React Email), scheduling, mailing lists |
| **Team** | Org accounts, roles, audit trail |

---

## Disclaimer

Educational / prototype use only. **Not** financial, legal, tax, or investment advice.

The app is for **orienting your plan** from numbers and copy in the UI. It does **not** promise a particular outcome (including company survival). When you execute bridges, restructuring, wind-down, M&A, layoffs, or other moves with legal or tax edges, use **qualified legal and tax review** so execution stays clean — that review complements your plan; it does not replace addressing cash, burn, and stakeholder reality.

---

## License

[MIT](./LICENSE). `package.json` sets `"private": true` so `npm publish` is blocked by default.
