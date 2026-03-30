import type { RunwayState } from "../types/runway";
import { getSupabase } from "./supabase";

async function ensureUser(): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (user) return user.id;
    const { error } = await sb.auth.signInAnonymously();
    if (error) return null;
    const u = (await sb.auth.getUser()).data.user;
    return u?.id ?? null;
  } catch {
    return null;
  }
}

export async function pullSnapshot(): Promise<RunwayState | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const uid = await ensureUser();
    if (!uid) return null;
    const { data, error } = await sb.from("user_finance").select("*").eq("user_id", uid).maybeSingle();
    if (error || !data) return null;
    return {
      cashOnHand: Number(data.cash_on_hand),
      monthlyBurn: Number(data.monthly_burn),
      monthlyRevenue: Number(data.monthly_revenue),
      momGrowthPct: Number(data.mom_growth_pct),
    };
  } catch {
    return null;
  }
}

export async function pushSnapshot(state: RunwayState): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  try {
    const uid = await ensureUser();
    if (!uid) return;
    const { error } = await sb.from("user_finance").upsert(
      {
        user_id: uid,
        cash_on_hand: state.cashOnHand,
        monthly_burn: state.monthlyBurn,
        monthly_revenue: state.monthlyRevenue,
        mom_growth_pct: state.momGrowthPct,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    if (error) return;
  } catch {
    /* ignore */
  }
}
