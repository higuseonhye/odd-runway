import { RUNWAY_DEADLINES } from "../lib/deadlines";

export function DeadlinesSection() {
  return (
    <section id="deadlines" className="scroll-mt-20 border-t border-line bg-surface/40 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted">
          Runway hygiene
        </h2>
        <p className="mt-2 max-w-xl text-2xl font-semibold tracking-tight text-ink">
          Non-negotiable deadlines — ship them like product releases.
        </p>
        <p className="mt-3 max-w-2xl text-muted">
          In the full product, each row gets a next due date, calendar sync, and stronger reminders
          when runway falls below 12–18 months.
        </p>
        <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-canvas">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Cadence</th>
                <th className="px-4 py-3 font-medium">Why it matters</th>
              </tr>
            </thead>
            <tbody>
              {RUNWAY_DEADLINES.map((row) => (
                <tr key={row.action} className="border-b border-line/80 last:border-0">
                  <td className="px-4 py-3 text-ink">{row.action}</td>
                  <td className="px-4 py-3 font-mono text-xs text-accent">{row.cadence}</td>
                  <td className="px-4 py-3 text-muted">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
