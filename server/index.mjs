/**
 * Minimal API: POST /api/investor-update — verifies Supabase JWT, sends HTML via Resend.
 * Run: node server/index.mjs (or npm run dev — starts with Vite)
 */
import "dotenv/config";
import cors from "cors";
import express from "express";
import { Resend } from "resend";

const PORT = Number(process.env.PORT) || 8787;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || "Runway <onboarding@resend.dev>";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "512kb" }));

async function verifySupabaseUser(authHeader) {
  if (!authHeader?.startsWith("Bearer ") || !SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  const jwt = authHeader.slice(7);
  const r = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      apikey: SUPABASE_ANON_KEY,
    },
  });
  if (!r.ok) return null;
  const body = await r.json();
  const u = body?.user ?? body;
  return u?.id ? u : null;
}

app.post("/api/investor-update", async (req, res) => {
  try {
    const user = await verifySupabaseUser(req.headers.authorization);
    if (!user) {
      return res.status(401).json({ error: "Invalid or missing session" });
    }
    if (!RESEND_API_KEY) {
      return res.status(503).json({ error: "RESEND_API_KEY is not set on the server" });
    }
    const { to, subject, html } = req.body ?? {};
    if (!to || typeof to !== "string" || !to.includes("@")) {
      return res.status(400).json({ error: "Invalid recipient `to`" });
    }
    if (!subject || typeof subject !== "string") {
      return res.status(400).json({ error: "Invalid `subject`" });
    }
    if (!html || typeof html !== "string") {
      return res.status(400).json({ error: "Invalid `html`" });
    }

    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: [to.trim()],
      subject: subject.trim(),
      html,
    });
    if (error) {
      return res.status(502).json({ error: error.message ?? "Resend error" });
    }
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e instanceof Error ? e.message : "Server error" });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, resend: Boolean(RESEND_API_KEY) });
});

app.listen(PORT, () => {
  console.log(`[Runway API] http://127.0.0.1:${PORT}`);
});
