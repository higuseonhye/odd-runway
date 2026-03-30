export function Footer() {
  return (
    <footer className="border-t border-line px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm text-muted">
          Prototype — not financial, legal, or tax advice. Resilience copy is for orienting your plan;
          for bridges, restructuring, wind-down, or M&A, use qualified legal and tax review so execution
          stays clean. Data stays in this browser (localStorage). Sign in with Supabase to sync runway
          state to your account.
        </p>
        <p className="font-mono text-xs text-muted">USD · CSV/Excel · optional cloud sync</p>
      </div>
    </footer>
  );
}
