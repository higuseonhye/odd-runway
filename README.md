# Runway

Web app for **US-market** startup founders: model **cash runway, burn, and investor rhythms** in one place (USD). The shell is **tabbed** (Overview · Runway · Playbooks · Tools) with **hash routing** (`#overview`, `#runway`, `#playbooks`, `#tools` and legacy anchors like `#simulator`, `#investor-email`).

**Overview** shows the **Hero**, **situation** (mode + silent insight + optional local pressure toggles), **quick** cash/burn, and **action cards** (in-app links + roadmap stubs for future agents). Other tabs skip the Hero so the main content reads like a focused screen. Use the **top tabs** or the **Runway** logo (→ Overview) to move between areas — there is no separate “back” control.

**Runway** is the full model: revenue, growth, optional **CSV/Excel** import (collapsed by default), optional **AR + collectibility %** and **monthly debt service** (headline runway uses adjusted liquidity; cash-only runway is shown for comparison). **Playbooks** stack **Crisis** + **Resilience** (accordions), including **worst-case / liquidity exhausted** copy. **Tools** holds investor email + deadlines.

The app infers an **operating mode**, does **not** assume survival, and frames legal/tax as **execution paperwork**, not therapy. **Stack:** Vite 5 · React 18 · TypeScript · Tailwind · Papa Parse · SheetJS (`xlsx`) · optional Supabase · optional Express + Resend.

---

## Features

| Area | What it does |
|------|----------------|
| **Tabs & hash** | Primary tabs above; deep links map to a tab (e.g. `#worst-extreme-liquidity` → Playbooks). |
| **Overview** | Hero (only on this tab), situation surface, quick runway, action cards. |
| **Action cards** | **Open** → in-app targets; **Roadmap** = future agents (benchmarks, CFO match, bridge scenarios — not built yet). Thin-runway / cash stress adds an extra **worst-case** card when relevant. |
| **Runway model** | Cash, burn, MRR-style revenue, MoM growth; optional **AR**, **AR collectibility %**, **debt service**; 12‑month chart (debt service in path; AR in headline months, not month-by-month in chart). |
| **Situation** | Mode (normal → survival) from **effective** runway; pressure chips (localStorage only). |
| **Playbooks** | Crisis tier by runway; Resilience accordions + **extreme liquidity** branch. |
| **Tools** | Investor update HTML + optional Resend send; deadline checklist. |
| **Data** | `localStorage`; optional **Supabase** sync (see migrations). |
| **Investor email** | Built from current state; send via API + Resend when configured. |

---

## Getting started

```bash
npm install
npm run dev
```

Starts **Vite** and the **Express** API (`server/index.mjs`, port **8787**); dev proxies `/api/*` to the API.

- **Frontend only:** `npm run dev:client`
- **API only:** `npm run dev:server`

```bash
npm run build
npm run preview
```

Deploy **`dist/`** to a static host. For **Resend** in production, run the API and set `VITE_API_URL` to that origin (or one reverse proxy).

**Smoke test:** Runway tab → optional CSV **Apply**; Tools → investor email (after Resend + sign-in if using API).

---

## Investor emails (Resend)

1. [resend.com](https://resend.com) — API key; production **verify a domain** for `from`.
2. `.env` (see `.env.example`): `RESEND_API_KEY`, optional `RESEND_FROM`, Supabase vars for session verification on `POST /api/investor-update`.
3. Sign in (if Supabase enabled), open **Tools** → investor email → **Send via Resend**.

---

## CI

GitHub Actions: `npm ci` and `npm run build` on push/PR to `main` / `master` (`.github/workflows/ci.yml`).

---

## Sample data

| File | Role |
|------|------|
| `public/sample-runway-transactions.csv` | Demo transactions (USD) |
| `public/sample-runway-transactions.xlsx` | Same for Excel |

```bash
npm run generate:sample
```

---

## Supabase (sign-in + sync)

1. Create a project at [supabase.com](https://supabase.com).
2. **Authentication → URL configuration:** Site URL = app origin (`http://localhost:5173` in dev).
3. **Email** provider enabled.
4. Run SQL migrations **in order** in the SQL editor:

   - `20250330120000_user_finance.sql` — `user_finance` (cash, burn, revenue, growth)
   - `20250330120001_profiles.sql` — `profiles` (optional, user display)
   - `20250330120002_user_finance_liquidity.sql` — AR, debt service, AR collectibility %

5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.

Without Supabase env vars, the app works offline-only (no sign-in).

---

## Styling note

Global `body` colors live in `src/index.css` (`@tailwind` + `@apply bg-canvas text-ink`) so the dark theme stays consistent if HTML omits duplicate classes.

---

## Product roadmap (beyond this repo)

| Phase | Ideas |
|-------|--------|
| **Agents** | Action-card integrations: research, people match, capital scenarios |
| **Integrations** | Plaid / Stripe / QuickBooks |
| **Comms** | React Email templates, scheduling |
| **Team** | Org accounts, roles |

---

## Disclaimer

Educational / prototype use only. **Not** financial, legal, tax, or investment advice.

The app **does not** promise any outcome (including company survival). For bridges, restructuring, wind-down, M&A, or payroll law, use **qualified legal and tax** help — that complements your operating plan; it does not replace cash, burn, and stakeholder reality.

---

## License

[MIT](./LICENSE). `package.json` sets `"private": true` so `npm publish` is blocked by default.
