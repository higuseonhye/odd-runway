import type { TabId } from "../hooks/useHashTab";

const btnPrimary =
  "inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition hover:bg-accent/90";

const btnSecondary =
  "inline-flex items-center justify-center rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink transition hover:border-accent/50 hover:bg-surface/80";

type Props = {
  activeTab: TabId;
};

export function Hero({ activeTab }: Props) {
  const overviewActive = activeTab === "overview";
  const runwayActive = activeTab === "runway";

  return (
    <section className="relative overflow-hidden bg-grid-fade px-4 pb-10 pt-12 sm:px-6 sm:pb-12 sm:pt-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 inline-flex rounded-full border border-line bg-surface/80 px-3 py-1 font-mono text-xs font-medium text-accent">
          For US seed &amp; Series A founders
        </p>
        <h1 className="max-w-3xl text-3xl font-bold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-5xl">
          Cash runway in one place — <span className="text-muted">then choose your next move.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">
          Overview shows your situation and action cards; full model and tools live on their tabs — less
          scrolling, same saved state.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#overview"
            aria-current={overviewActive ? "page" : undefined}
            className={overviewActive ? btnPrimary : btnSecondary}
          >
            Open overview
          </a>
          <a
            href="#runway"
            aria-current={runwayActive ? "page" : undefined}
            className={runwayActive ? btnPrimary : btnSecondary}
          >
            Full runway model
          </a>
        </div>
      </div>
    </section>
  );
}