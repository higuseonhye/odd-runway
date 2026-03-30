import Papa from "papaparse";

export type CsvModelSuggestion = {
  cashOnHand: number | null;
  monthlyBurn: number;
  monthlyRevenue: number;
  momGrowthPct: number;
  monthsUsed: number;
  message: string;
};

type MonthlyAgg = { monthKey: string; outflows: number; inflows: number };

function normKey(k: string): string {
  return k.trim().toLowerCase().replace(/\s+/g, " ");
}

function pickDateKey(keys: string[]): string | null {
  const patterns = [/date/, /posted/, /transaction/, /time/];
  for (const k of keys) {
    const n = normKey(k);
    if (patterns.some((p) => p.test(n)) && !n.includes("balance")) return k;
  }
  return null;
}

function pickAmountKeys(keys: string[]): { amount?: string; debit?: string; credit?: string } {
  const lower = keys.map((k) => ({ k, n: normKey(k) }));
  let amount: string | undefined;
  let debit: string | undefined;
  let credit: string | undefined;
  for (const { k, n } of lower) {
    if (n === "amount" || (n.includes("amount") && !n.includes("balance"))) amount = k;
    if (n === "debit" || n.includes("withdrawal")) debit = k;
    if (n === "credit" || n.includes("deposit")) credit = k;
  }
  if (!amount && debit && credit) return { debit, credit };
  if (amount) return { amount };
  for (const { k, n } of lower) {
    if (n.includes("amount")) amount = k;
  }
  return amount ? { amount } : {};
}

function pickBalanceKey(keys: string[]): string | null {
  for (const k of keys) {
    const n = normKey(k);
    if (n.includes("balance") && !n.includes("available")) return k;
  }
  return null;
}

function parseMoney(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const s = String(v).replace(/[$,]/g, "").trim();
  if (s === "" || s === "—") return null;
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

function parseDate(v: unknown): Date | null {
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v;
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (!s) return null;
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d;
  const mdy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (mdy) {
    const mm = Number(mdy[1]);
    const dd = Number(mdy[2]);
    let yy = Number(mdy[3]);
    if (yy < 100) yy += 2000;
    const t = new Date(yy, mm - 1, dd);
    return Number.isNaN(t.getTime()) ? null : t;
  }
  return null;
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}

export type CsvParseResult =
  | { ok: true; suggestion: CsvModelSuggestion }
  | { ok: false; error: string };

export function parseBankCsv(file: string): CsvParseResult {
  const parsed = Papa.parse<Record<string, unknown>>(file, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  if (parsed.errors.length > 0 && (!parsed.data || parsed.data.length === 0)) {
    return { ok: false, error: parsed.errors[0]?.message ?? "Could not parse CSV." };
  }

  const rows = parsed.data.filter((r) => Object.keys(r).some((k) => String(r[k]).trim() !== ""));
  if (rows.length < 5) {
    return { ok: false, error: "Need more rows (at least ~5 transactions) for a stable estimate." };
  }

  const keys = Object.keys(rows[0] ?? {});
  const dateKey = pickDateKey(keys);
  const balanceKey = pickBalanceKey(keys);
  const { amount: amountKey, debit, credit } = pickAmountKeys(keys);

  if (!dateKey) {
    return { ok: false, error: "Could not find a date column (look for Date, Posted, Transaction date)." };
  }

  if (!amountKey && !(debit && credit)) {
    return {
      ok: false,
      error: "Could not find Amount or Debit/Credit columns. Export a standard activity CSV.",
    };
  }

  type Row = { date: Date; signed: number; balance: number | null };
  const clean: Row[] = [];

  for (const r of rows) {
    const d = parseDate(r[dateKey]);
    if (!d) continue;

    let signed: number | null = null;
    if (amountKey) {
      const raw = parseMoney(r[amountKey]);
      if (raw === null) continue;
      signed = raw;
    } else if (debit && credit) {
      const db = parseMoney(r[debit]) ?? 0;
      const cr = parseMoney(r[credit]) ?? 0;
      signed = cr - db;
    }

    if (signed === null) continue;

    let balance: number | null = null;
    if (balanceKey) {
      balance = parseMoney(r[balanceKey]);
    }

    clean.push({ date: d, signed, balance });
  }

  if (clean.length < 5) {
    return { ok: false, error: "Not enough dated rows with amounts after cleaning." };
  }

  clean.sort((a, b) => a.date.getTime() - b.date.getTime());

  const byMonth = new Map<string, MonthlyAgg>();
  for (const row of clean) {
    const mk = monthKey(row.date);
    if (!byMonth.has(mk)) byMonth.set(mk, { monthKey: mk, outflows: 0, inflows: 0 });
    const b = byMonth.get(mk)!;
    if (row.signed < 0) b.outflows += -row.signed;
    if (row.signed > 0) b.inflows += row.signed;
  }

  const months = [...byMonth.values()].sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  const lastMonths = months.slice(-6);
  if (lastMonths.length < 2) {
    return { ok: false, error: "Need transactions spanning at least two calendar months." };
  }

  const outVals = lastMonths.map((m) => m.outflows);
  const inVals = lastMonths.map((m) => m.inflows);
  const monthlyBurn = median(outVals);
  const monthlyRevenue = median(inVals);

  const revSeries = lastMonths.map((m) => m.inflows);
  let momGrowthPct = 8;
  if (revSeries.length >= 2) {
    const a = revSeries[revSeries.length - 2]!;
    const b = revSeries[revSeries.length - 1]!;
    if (a > 100 && b > 100) {
      momGrowthPct = Math.min(22, Math.max(-8, ((b - a) / a) * 100));
    }
  }

  let cashOnHand: number | null = null;
  const last = clean[clean.length - 1]!;
  if (last.balance !== null && last.balance > 0) {
    cashOnHand = last.balance;
  }

  const monthsUsed = lastMonths.length;
  const suggestion: CsvModelSuggestion = {
    cashOnHand,
    monthlyBurn: Math.round(monthlyBurn / 1000) * 1000,
    monthlyRevenue: Math.round(monthlyRevenue / 1000) * 1000,
    momGrowthPct: Math.round(momGrowthPct * 10) / 10,
    monthsUsed,
    message: cashOnHand
      ? `Used ${monthsUsed} month window from your CSV. Cash from latest balance column.`
      : `Used ${monthsUsed} month window. Set cash on hand manually if balance wasn’t in the export.`,
  };

  return { ok: true, suggestion };
}
