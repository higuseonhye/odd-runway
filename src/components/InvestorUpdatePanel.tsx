import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { buildInvestorUpdateHtml } from "../lib/investorEmailHtml";
import type { RunwayState } from "../types/runway";

type Props = {
  runwayState: RunwayState;
  runwayMonths: number | null;
};

function apiBase(): string {
  const base = import.meta.env.VITE_API_URL as string | undefined;
  return base?.replace(/\/$/, "") ?? "";
}

export function InvestorUpdatePanel({ runwayState, runwayMonths }: Props) {
  const { user, accessToken, supabaseConfigured } = useAuth();
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState(() => {
    const d = new Date();
    return `Investor update — ${d.toLocaleString("en-US", { month: "long", year: "numeric" })}`;
  });
  const [wins, setWins] = useState("");
  const [asks, setAsks] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [message, setMessage] = useState<string | null>(null);

  if (!supabaseConfigured || !user) {
    return (
      <section id="investor-email" className="scroll-mt-20 border-t border-line px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-xl border border-line bg-surface/40 p-6 text-sm text-muted">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
            Investor email
          </span>
          <p className="mt-2">
            Sign in with Supabase and run the API server to send monthly investor updates via Resend.
          </p>
        </div>
      </section>
    );
  }

  async function send() {
    setMessage(null);
    if (!accessToken) {
      setStatus("err");
      setMessage("No session. Sign in again.");
      return;
    }
    if (!to.trim()) {
      setStatus("err");
      setMessage("Enter a recipient email.");
      return;
    }
    const html = buildInvestorUpdateHtml(runwayState, runwayMonths, { wins, asks });
    setStatus("sending");
    try {
      const res = await fetch(`${apiBase()}/api/investor-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ to: to.trim(), subject: subject.trim(), html }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("err");
        setMessage(data.error ?? res.statusText);
        return;
      }
      setStatus("ok");
      setMessage("Email sent.");
    } catch (e) {
      setStatus("err");
      setMessage(e instanceof Error ? e.message : "Request failed. Is the API server running?");
    }
  }

  return (
    <section id="investor-email" className="scroll-mt-20 border-t border-line px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
          Investor email (Resend)
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Draft uses your current simulator numbers. Add wins and asks, then send a test. Requires the
          local API server (<code className="font-mono text-xs text-ink">npm run dev</code> runs Vite +
          API) and <code className="font-mono text-xs text-ink">RESEND_API_KEY</code> in{" "}
          <code className="font-mono text-xs text-ink">.env</code>.
        </p>

        <div className="mt-6 grid gap-4 rounded-2xl border border-line bg-surface/60 p-6 sm:grid-cols-2">
          <div className="space-y-3 sm:col-span-2">
            <label className="text-xs text-muted">To</label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="investor@firm.com"
              className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
          </div>
          <div className="space-y-3 sm:col-span-2">
            <label className="text-xs text-muted">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs text-muted">Wins (one per line)</label>
            <textarea
              value={wins}
              onChange={(e) => setWins(e.target.value)}
              rows={5}
              className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
              placeholder="Shipped v2 of…"
            />
          </div>
          <div>
            <label className="text-xs text-muted">Asks (one per line)</label>
            <textarea
              value={asks}
              onChange={(e) => setAsks(e.target.value)}
              rows={5}
              className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
              placeholder="Intro to…"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="button"
              disabled={status === "sending"}
              onClick={() => void send()}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 hover:bg-accent/90 disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Send via Resend"}
            </button>
            {message && (
              <p
                className={`mt-3 text-sm ${status === "ok" ? "text-ok" : status === "err" ? "text-danger" : "text-muted"}`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
