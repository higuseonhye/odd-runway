export function InvestorStrip() {
  return (
    <section className="border-y border-line bg-surface/30 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
            Investor communication
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            The monthly update founders actually ship.
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Burn, runway, MoM growth, wins, asks — formatted for email or Notion, sourced from
            Plaid + QuickBooks when you connect accounts. That&apos;s the wedge that earns $49/mo.
          </p>
        </div>
        <ul className="shrink-0 space-y-2 font-mono text-xs text-muted">
          <li className="flex items-center gap-2">
            <span className="text-ok">●</span> Resend + React Email templates
          </li>
          <li className="flex items-center gap-2">
            <span className="text-ok">●</span> Clerk auth · USD-first
          </li>
          <li className="flex items-center gap-2">
            <span className="text-warn">○</span> Plaid / Stripe (post-MVP)
          </li>
        </ul>
      </div>
    </section>
  );
}
