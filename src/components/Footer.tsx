export function Footer() {
  return (
    <footer className="border-t border-line px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Prototype — not financial advice. Numbers stay in this browser; add optional Supabase
          (free tier) to sync encrypted state.
        </p>
        <p className="font-mono text-xs text-muted">USD · CSV import · localStorage</p>
      </div>
    </footer>
  );
}
