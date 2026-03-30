import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { TabId } from "../hooks/useHashTab";
import { AuthModal } from "./AuthModal";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "runway", label: "Runway" },
  { id: "playbooks", label: "Playbooks" },
  { id: "tools", label: "Tools" },
];

type Props = {
  tab: TabId;
  onTabChange: (t: TabId) => void;
};

export function Header({ tab, onTabChange }: Props) {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, loading, supabaseConfigured, signOut } = useAuth();

  return (
    <>
      <header className="border-b border-line/80 bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => onTabChange("overview")}
            className="flex min-w-0 items-center gap-2 font-semibold tracking-tight text-ink"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface font-mono text-sm text-accent ring-1 ring-line">
              R
            </span>
            <span className="truncate">Runway</span>
          </button>
          <nav className="order-3 flex w-full gap-1 overflow-x-auto pb-1 sm:order-none sm:w-auto sm:pb-0">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange(id)}
                aria-current={tab === id ? "page" : undefined}
                className={`shrink-0 rounded-full px-3 py-1.5 font-mono text-xs font-medium transition sm:text-sm ${
                  tab === id
                    ? "bg-accent text-white shadow-md shadow-accent/20"
                    : "text-muted hover:bg-surface hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
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
          </div>
        </div>
      </header>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
