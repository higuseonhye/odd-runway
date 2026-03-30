import { useCallback, useEffect, useRef, useState } from "react";
import { loadRunwayState, saveRunwayState } from "../lib/persist";
import { pullSnapshot, pushSnapshot } from "../lib/syncSupabase";
import { SCENARIOS, scenarioToRunwayState } from "../lib/scenarios";
import type { CsvModelSuggestion } from "../lib/csvFinance";
import type { RunwayState } from "../types/runway";

export type { RunwayState } from "../types/runway";

const defaultScenario = SCENARIOS[0]!;

const initial: RunwayState = scenarioToRunwayState(defaultScenario);

type Props = {
  userId: string | null;
  authReady: boolean;
};

export function useRunwayState({ userId, authReady }: Props) {
  const [state, setState] = useState<RunwayState>(() => loadRunwayState(initial));
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulledForUser = useRef<string | null>(null);

  useEffect(() => {
    if (!authReady) return;
    if (!userId) {
      pulledForUser.current = null;
      return;
    }
    if (pulledForUser.current === userId) return;
    pulledForUser.current = userId;
    void (async () => {
      const cloud = await pullSnapshot();
      if (cloud) setState(cloud);
    })();
  }, [authReady, userId]);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveRunwayState(state);
      void pushSnapshot(state);
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state]);

  const setCashOnHand = useCallback((v: number) => {
    setState((s) => ({ ...s, cashOnHand: v }));
  }, []);
  const setMonthlyBurn = useCallback((v: number) => {
    setState((s) => ({ ...s, monthlyBurn: v }));
  }, []);
  const setMonthlyRevenue = useCallback((v: number) => {
    setState((s) => ({ ...s, monthlyRevenue: v }));
  }, []);
  const setMomGrowthPct = useCallback((v: number) => {
    setState((s) => ({ ...s, momGrowthPct: v }));
  }, []);
  const setAccountsReceivable = useCallback((v: number) => {
    setState((s) => ({ ...s, accountsReceivable: v }));
  }, []);
  const setMonthlyDebtService = useCallback((v: number) => {
    setState((s) => ({ ...s, monthlyDebtService: v }));
  }, []);
  const setArCollectibilityPct = useCallback((v: number) => {
    setState((s) => ({ ...s, arCollectibilityPct: v }));
  }, []);

  const applyCsvSuggestion = useCallback((suggestion: CsvModelSuggestion) => {
    setState((prev) => ({
      ...prev,
      cashOnHand: suggestion.cashOnHand ?? prev.cashOnHand,
      monthlyBurn: suggestion.monthlyBurn,
      monthlyRevenue: suggestion.monthlyRevenue,
      momGrowthPct: suggestion.momGrowthPct,
    }));
  }, []);

  const applyPreset = useCallback((p: RunwayState) => {
    setState(p);
  }, []);

  return {
    ...state,
    setCashOnHand,
    setMonthlyBurn,
    setMonthlyRevenue,
    setMomGrowthPct,
    setAccountsReceivable,
    setMonthlyDebtService,
    setArCollectibilityPct,
    applyCsvSuggestion,
    applyPreset,
  };
}
