import { useMemo } from "react";
import { useAuth } from "./contexts/AuthContext";
import { CrisisPanel } from "./components/CrisisPanel";
import { DeadlinesSection } from "./components/DeadlinesSection";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { InvestorStrip } from "./components/InvestorStrip";
import { InvestorUpdatePanel } from "./components/InvestorUpdatePanel";
import { ResiliencePanel } from "./components/ResiliencePanel";
import { RunwaySimulator } from "./components/RunwaySimulator";
import { SituationSurface } from "./components/SituationSurface";
import { usePressureFlags } from "./hooks/usePressureFlags";
import { useRunwayState } from "./hooks/useRunwayState";
import { netBurn, runwayMonths } from "./lib/finance";
import { inferSituation } from "./lib/situationInference";

export default function App() {
  const { userId, loading: authLoading } = useAuth();
  const runwayState = useRunwayState({
    userId,
    authReady: !authLoading,
  });
  const { flags, toggle } = usePressureFlags();

  const runway = useMemo(() => {
    const nb = netBurn(runwayState.monthlyBurn, runwayState.monthlyRevenue);
    return runwayMonths(runwayState.cashOnHand, nb);
  }, [runwayState.cashOnHand, runwayState.monthlyBurn, runwayState.monthlyRevenue]);

  const inferred = useMemo(
    () => inferSituation(runwayState, runway, flags),
    [
      runwayState.cashOnHand,
      runwayState.monthlyBurn,
      runwayState.monthlyRevenue,
      runwayState.momGrowthPct,
      runway,
      flags,
    ]
  );

  return (
    <>
      <Header />
      <main>
        <Hero />
        <InvestorStrip />
        <SituationSurface inferred={inferred} flags={flags} onTogglePressure={toggle} />
        <RunwaySimulator
          cashOnHand={runwayState.cashOnHand}
          monthlyBurn={runwayState.monthlyBurn}
          monthlyRevenue={runwayState.monthlyRevenue}
          momGrowthPct={runwayState.momGrowthPct}
          onCashChange={runwayState.setCashOnHand}
          onBurnChange={runwayState.setMonthlyBurn}
          onRevenueChange={runwayState.setMonthlyRevenue}
          onMomChange={runwayState.setMomGrowthPct}
          onApplyPreset={runwayState.applyPreset}
          onApplyCsv={runwayState.applyCsvSuggestion}
        />
        <CrisisPanel runwayMonths={runway} />
        <ResiliencePanel mode={inferred.mode} />
        <InvestorUpdatePanel runwayState={runwayState} runwayMonths={runway} />
        <DeadlinesSection />
      </main>
      <Footer />
    </>
  );
}
