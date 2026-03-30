import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "./AuthModal";

export function Header() {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, loading, supabaseConfigured, signOut } = useAuth();

  return (
    <>
      <header className="border-b border-line/80 bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <a href="#" className="flex items-center gap-2 font-semibold tracking-tight text-ink">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface font-mono text-sm text-accent ring-1 ring-line">
              R
            </span>
            Runway
          </a>
          <nav className="hidden items-center gap-8 text-sm text-muted sm:flex">
            <a href="#simulator" className="hover:text-ink">
              Simulator
            </a>
            <a href="#crisis" className="hover:text-ink">
              Crisis playbook
            </a>
            <a href="#deadlines" className="hover:text-ink">
              Deadlines
            </a>
            <a href="#investor-email" className="hover:text-ink">
              Investor email
            </a>
          </nav>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {supabaseConfigured && !loading && (
              <>
                {user ? (
                  <>
                    <span className="hidden max-w-[140px] truncate font-mono text-xs text-muted sm:inline">
                      {user.email}
                    </span>
                    <button
                      type="button"
                      onClick={() => void signOut()}
                      className="rounded-full border border-line bg-surface px-3 py-2 text-sm font-medium text-ink hover:border-accent/50"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuthOpen(true)}
                    className="rounded-full border border-line bg-surface px-3 py-2 text-sm font-medium text-ink hover:border-accent/50"
                  >
                    Sign in
                  </button>
                )}
              </>
            )}
            <a
              href="#simulator"
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white shadow-lg shadow-accent/25 transition hover:bg-accent/90"
            >
              Open simulator
            </a>
          </div>
        </div>
      </header>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
