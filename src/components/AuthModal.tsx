import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AuthModal({ open, onClose }: Props) {
  const { supabaseConfigured, signInWithOtp, signInWithPassword, signUp } = useAuth();
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!open) return null;

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setPending(true);
    const { error: err } = await signInWithOtp(email);
    setPending(false);
    if (err) setError(err.message);
    else setMessage("Check your email for the sign-in link.");
  }

  async function handlePasswordSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setPending(true);
    const { error: err } = await signInWithPassword(email, password);
    setPending(false);
    if (err) setError(err.message);
    else onClose();
  }

  async function handleSignUp() {
    setError(null);
    setMessage(null);
    setPending(true);
    const { error: err } = await signUp(email, password);
    setPending(false);
    if (err) setError(err.message);
    else setMessage("Confirm your email if required, then sign in.");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <h2 id="auth-title" className="text-lg font-semibold text-ink">
            Sign in
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-line hover:text-ink"
          >
            Close
          </button>
        </div>

        {!supabaseConfigured ? (
          <p className="mt-4 text-sm text-muted">
            Add <code className="font-mono text-xs text-accent">VITE_SUPABASE_URL</code> and{" "}
            <code className="font-mono text-xs text-accent">VITE_SUPABASE_ANON_KEY</code> to{" "}
            <code className="font-mono text-xs">.env</code>, then restart the dev server.
          </p>
        ) : (
          <>
            <div className="mt-4 flex gap-2 rounded-full bg-canvas p-1">
              <button
                type="button"
                onClick={() => setMode("magic")}
                className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium ${
                  mode === "magic" ? "bg-accent text-white" : "text-muted hover:text-ink"
                }`}
              >
                Magic link
              </button>
              <button
                type="button"
                onClick={() => setMode("password")}
                className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium ${
                  mode === "password" ? "bg-accent text-white" : "text-muted hover:text-ink"
                }`}
              >
                Email + password
              </button>
            </div>

            {mode === "magic" ? (
              <form onSubmit={handleMagicLink} className="mt-4 space-y-3">
                <div>
                  <label className="text-xs text-muted" htmlFor="auth-email-magic">
                    Email
                  </label>
                  <input
                    id="auth-email-magic"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-50"
                >
                  {pending ? "Sending…" : "Send magic link"}
                </button>
              </form>
            ) : (
              <div className="mt-4 space-y-3">
                <form onSubmit={handlePasswordSignIn} className="space-y-3">
                  <div>
                    <label className="text-xs text-muted" htmlFor="auth-email-pw">
                      Email
                    </label>
                    <input
                      id="auth-email-pw"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted" htmlFor="auth-password">
                      Password
                    </label>
                    <input
                      id="auth-password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-50"
                  >
                    {pending ? "…" : "Sign in"}
                  </button>
                </form>
                <div className="border-t border-line pt-3">
                  <p className="mb-2 text-xs text-muted">New here?</p>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => void handleSignUp()}
                    className="w-full rounded-full border border-line bg-transparent py-2.5 text-sm font-medium text-ink hover:border-accent/50 disabled:opacity-50"
                  >
                    Create account
                  </button>
                </div>
              </div>
            )}

            {error && (
              <p className="mt-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}
            {message && (
              <p className="mt-3 rounded-lg border border-ok/40 bg-ok/10 px-3 py-2 text-sm text-ok">
                {message}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
