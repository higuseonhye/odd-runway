import type { RunwayState } from "../types/runway";
import { getSupabase } from "./supabase";

async function getSessionUserId(): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const {
      data: { session },
    } = await sb.auth.getSession();
    return session?.user.id ?? null;
  } catch {
    return null;
  }
}

export async function pullSnapshot(): Promise<RunwayState | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const uid = await getSessionUserId();
    if (!uid) return null;
    const { data, error } = await sb.from("user_finance").select("*").eq("user_id", uid).maybeSingle();
    if (error || !data) return null;
    return {
      cashOnHand: Number(data.cash_on_hand),
      monthlyBurn: Number(data.monthly_burn),
      monthlyRevenue: Number(data.monthly_revenue),
      momGrowthPct: Number(data.mom_growth_pct),
      accountsReceivable: Number(data.accounts_receivable ?? 0),
      monthlyDebtService: Number(data.monthly_debt_service ?? 0),
      arCollectibilityPct: Number(data.ar_collectibility_pct ?? 50),
    };
  } catch {
    return null;
  }
}

export async function pushSnapshot(state: RunwayState): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  try {
    const uid = await getSessionUserId();
    if (!uid) return;
    const { error } = await sb.from("user_finance").upsert(
      {
        user_id: uid,
        cash_on_hand: state.cashOnHand,
        monthly_burn: state.monthlyBurn,
        monthly_revenue: state.monthlyRevenue,
        mom_growth_pct: state.momGrowthPct,
        accounts_receivable: state.accountsReceivable,
        monthly_debt_service: state.monthlyDebtService,
        ar_collectibility_pct: state.arCollectibilityPct,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    if (error) return;
  } catch {
    /* ignore */
  }
}
