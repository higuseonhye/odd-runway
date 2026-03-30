export function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid-fade px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 inline-flex rounded-full border border-line bg-surface/80 px-3 py-1 font-mono text-xs font-medium text-accent">
          For US seed &amp; Series A founders
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          Financial anxiety is a tax on building.{" "}
          <span className="text-muted">Remove it.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          Runway models your cash, burn, and growth in USD, surfaces what to do before you hit the
          floor, and nudges the investor rhythms that keep optionality alive — so you get back to
          the product.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#simulator"
            className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition hover:bg-accent/90"
          >
            Try the runway model
          </a>
          <a
            href="#deadlines"
            className="inline-flex items-center justify-center rounded-full border border-line bg-surface px-6 py-3 text-sm font-medium text-ink transition hover:border-accent/50"
          >
            See runway hygiene
          </a>
        </div>
        <ul className="mt-14 grid gap-6 border-t border-line pt-10 sm:grid-cols-3">
          <li>
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent">
              Investor updates
            </p>
            <p className="mt-2 text-sm text-muted">
              Burn, runway, MoM growth — the cadence investors expect, without living in a
              spreadsheet.
            </p>
          </li>
          <li>
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent">
              Before the floor
            </p>
            <p className="mt-2 text-sm text-muted">
              Tiered actions when runway gets short; math-backed nudges, not generic advice.
            </p>
          </li>
          <li>
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent">
              18+ months
            </p>
            <p className="mt-2 text-sm text-muted">
              Plan for US fundraising timelines — often 6+ months before a wire hits.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
