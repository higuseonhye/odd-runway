import { useEffect, useMemo } from "react";
import { useAuth } from "./contexts/AuthContext";
import { ActionCards } from "./components/ActionCards";
import { CrisisPanel } from "./components/CrisisPanel";
import { DeadlinesSection } from "./components/DeadlinesSection";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { InvestorUpdatePanel } from "./components/InvestorUpdatePanel";
import { QuickRunwayPanel } from "./components/QuickRunwayPanel";
import { ResiliencePanel } from "./components/ResiliencePanel";
import { RunwaySimulator } from "./components/RunwaySimulator";
import { SituationSurface } from "./components/SituationSurface";
import { tabFromHash, useHashTab } from "./hooks/useHashTab";
import { usePressureFlags } from "./hooks/usePressureFlags";
import { useRunwayState } from "./hooks/useRunwayState";
import { buildActionCards } from "./lib/actionCards";
import { runwayMonthsEffective } from "./lib/finance";
import { inferSituation } from "./lib/situationInference";

export default function App() {
  const { userId, loading: authLoading } = useAuth();
  const [tab, setTab] = useHashTab();
  const runwayState = useRunwayState({
    userId,
    authReady: !authLoading,
  });
  const { flags, toggle } = usePressureFlags();

  const runway = useMemo(
    () => runwayMonthsEffective(runwayState),
    [runwayState]
  );

  const inferred = useMemo(
    () => inferSituation(runwayState, runway, flags),
    [runwayState, runway, flags]
  );

  const actionCards = useMemo(
    () => buildActionCards(inferred, runwayState),
    [inferred, runwayState]
  );

  const navigate = (href: string) => {
    const h = href.startsWith("#") ? href.slice(1) : href;
    window.location.hash = h;
  };

  useEffect(() => {
    const scrollSubtargets = () => {
      const raw = window.location.hash.replace(/^#/, "");
      const tabId = tabFromHash(window.location.hash);
      if (tabId === "tools" && (raw === "investor-email" || raw === "deadlines")) {
        requestAnimationFrame(() => {
          document.getElementById(raw)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      if (tabId === "playbooks" && raw === "worst-extreme-liquidity") {
        requestAnimationFrame(() => {
          document.getElementById("worst-extreme-liquidity")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
    };
    scrollSubtargets();
    window.addEventListener("hashchange", scrollSubtargets);
    return () => window.removeEventListener("hashchange", scrollSubtargets);
  }, [tab]);

  return (
    <>
      <Header tab={tab} onTabChange={setTab} />
      <main className="min-h-[60vh]">
        {tab === "overview" && (
          <>
            <Hero activeTab={tab} />
            <section id="overview" className="scroll-mt-12 px-4 pb-12 sm:px-6">
              <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_minmax(280px,380px)] lg:items-start">
                <div className="space-y-6">
                  <SituationSurface
                    inferred={inferred}
                    flags={flags}
                    onTogglePressure={toggle}
                    variant="compact"
                  />
                  <QuickRunwayPanel
                    runwayState={runwayState}
                    onCashChange={runwayState.setCashOnHand}
                    onBurnChange={runwayState.setMonthlyBurn}
                    onApplyPreset={runwayState.applyPreset}
                    onOpenFullModel={() => setTab("runway")}
                  />
                </div>
                <ActionCards cards={actionCards} onNavigate={navigate} />
              </div>
            </section>
          </>
        )}
        {tab === "runway" && (
          <RunwaySimulator
            cashOnHand={runwayState.cashOnHand}
            monthlyBurn={runwayState.monthlyBurn}
            monthlyRevenue={runwayState.monthlyRevenue}
            momGrowthPct={runwayState.momGrowthPct}
            accountsReceivable={runwayState.accountsReceivable}
            monthlyDebtService={runwayState.monthlyDebtService}
            arCollectibilityPct={runwayState.arCollectibilityPct}
            onCashChange={runwayState.setCashOnHand}
            onBurnChange={runwayState.setMonthlyBurn}
            onRevenueChange={runwayState.setMonthlyRevenue}
            onMomChange={runwayState.setMomGrowthPct}
            onAccountsReceivableChange={runwayState.setAccountsReceivable}
            onMonthlyDebtServiceChange={runwayState.setMonthlyDebtService}
            onArCollectibilityPctChange={runwayState.setArCollectibilityPct}
            onApplyPreset={runwayState.applyPreset}
            onApplyCsv={runwayState.applyCsvSuggestion}
          />
        )}
        {tab === "playbooks" && (
          <div id="playbooks" className="scroll-mt-20">
            <CrisisPanel runwayMonths={runway} />
            <ResiliencePanel mode={inferred.mode} />
          </div>
        )}
        {tab === "tools" && (
          <div id="tools" className="scroll-mt-20">
            <div className="border-b border-line/80 px-4 py-8 sm:px-6">
              <div className="mx-auto max-w-5xl">
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
                  Tools
                </p>
                <h2 className="mt-2 text-xl font-semibold text-ink sm:text-2xl">
                  Investor email and runway hygiene
                </h2>
                <p className="mt-2 max-w-xl text-sm text-muted">
                  Same numbers as Overview — no extra import.
                </p>
              </div>
            </div>
            <InvestorUpdatePanel runwayState={runwayState} runwayMonths={runway} />
            <DeadlinesSection />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
