import { useRef, useState } from "react";
import { parseBankCsv, type CsvModelSuggestion } from "../lib/csvFinance";
import { excelFileToCsvText } from "../lib/excelToCsv";

type Props = {
  onApply: (s: CsvModelSuggestion) => void;
};

const SAMPLE_CSV = "/sample-runway-transactions.csv";
const SAMPLE_XLSX = "/sample-runway-transactions.xlsx";

export function CsvImportPanel({ onApply }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<CsvModelSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fileToText(f: File): Promise<string> {
    const lower = f.name.toLowerCase();
    if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
      return excelFileToCsvText(f);
    }
    return f.text();
  }

  async function handleFile(f: File) {
    setError(null);
    setPending(null);
    setLoading(true);
    try {
      const text = await fileToText(f);
      const result = parseBankCsv(text);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setPending(result.suggestion);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-accent/30 bg-canvas/60 p-5 ring-1 ring-accent/20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
            Minimize typing
          </h3>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Upload <strong className="text-ink">CSV</strong> or <strong className="text-ink">Excel</strong>{" "}
            (.xlsx / .xls) — first sheet should look like a bank export (USD). We infer monthly
            outflows → burn, inflows → revenue, and ending balance → cash when present.
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
            <span className="font-medium text-ink">Demo files (same data):</span>
            <a
              href={SAMPLE_CSV}
              download="sample-runway-transactions.csv"
              className="font-medium text-accent underline-offset-2 hover:underline"
            >
              sample.csv
            </a>
            <span className="text-line">·</span>
            <a
              href={SAMPLE_XLSX}
              download="sample-runway-transactions.xlsx"
              className="font-medium text-accent underline-offset-2 hover:underline"
            >
              sample.xlsx
            </a>
            <span className="text-line">—</span>
            <span>Download either, then upload here to try the parser (no real bank data).</span>
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => inputRef.current?.click()}
            className="rounded-full border border-line bg-surface px-4 py-2 font-mono text-xs font-medium text-ink transition hover:border-accent/50 disabled:opacity-50"
          >
            {loading ? "Reading…" : "Choose CSV or Excel"}
          </button>
        </div>
      </div>

      <details className="mt-4 rounded-lg border border-line bg-surface/50 px-3 py-2 text-sm">
        <summary className="cursor-pointer font-medium text-ink">Example format (first row = headers)</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="py-2 pr-3 font-medium">Date</th>
                <th className="py-2 pr-3 font-medium">Description</th>
                <th className="py-2 pr-3 font-mono font-medium">Amount</th>
                <th className="py-2 font-mono font-medium">Balance</th>
              </tr>
            </thead>
            <tbody className="font-mono text-muted">
              <tr className="border-b border-line/80">
                <td className="py-1.5 pr-3 text-ink">11/04/2024</td>
                <td className="py-1.5 pr-3">Stripe payouts (MRR)</td>
                <td className="py-1.5 pr-3 text-ok">14200</td>
                <td className="py-1.5">2514200</td>
              </tr>
              <tr className="border-b border-line/80">
                <td className="py-1.5 pr-3 text-ink">11/06/2024</td>
                <td className="py-1.5 pr-3">Payroll — net</td>
                <td className="py-1.5 pr-3 text-danger">-38000</td>
                <td className="py-1.5">2476200</td>
              </tr>
              <tr>
                <td className="py-1.5 pr-3 text-ink">…</td>
                <td className="py-1.5 pr-3" colSpan={3}>
                  Negative amounts = cash out (burn); positive = in (revenue). Balance column is optional
                  but improves cash on hand.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>

      {error && (
        <p className="mt-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      {pending && (
        <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted">
            <p className="font-mono text-xs text-ink">
              Burn ~{formatUsd(pending.monthlyBurn)} · Rev ~{formatUsd(pending.monthlyRevenue)} · MoM{" "}
              {pending.momGrowthPct >= 0 ? "+" : ""}
              {pending.momGrowthPct.toFixed(1)}%
            </p>
            <p className="mt-1 text-xs">{pending.message}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onApply(pending);
              setPending(null);
            }}
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-accent/25 hover:bg-accent/90"
          >
            Apply to model
          </button>
        </div>
      )}
    </div>
  );
}

function formatUsd(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
