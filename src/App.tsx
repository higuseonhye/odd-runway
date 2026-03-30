import { useMemo } from "react";
import { netBurn, runwayMonths } from "./lib/finance";
import { CrisisPanel } from "./components/CrisisPanel";
import { DeadlinesSection } from "./components/DeadlinesSection";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { InvestorStrip } from "./components/InvestorStrip";
import { RunwaySimulator } from "./components/RunwaySimulator";
import { useRunwayState } from "./hooks/useRunwayState";

export default function App() {
  const runwayState = useRunwayState();

  const runway = useMemo(() => {
    const nb = netBurn(runwayState.monthlyBurn, runwayState.monthlyRevenue);
    return runwayMonths(runwayState.cashOnHand, nb);
  }, [runwayState.cashOnHand, runwayState.monthlyBurn, runwayState.monthlyRevenue]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <InvestorStrip />
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
        <DeadlinesSection />
      </main>
      <Footer />
    </>
  );
}
