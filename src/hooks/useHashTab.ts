import { useCallback, useEffect, useState } from "react";

export type TabId = "overview" | "runway" | "playbooks" | "tools";

const HASH: Record<TabId, string> = {
  overview: "#overview",
  runway: "#runway",
  playbooks: "#playbooks",
  tools: "#tools",
};

/** Map legacy / deep-link hashes to primary tabs. */
export function tabFromHash(hash: string): TabId {
  const raw = hash.replace(/^#/, "").split("?")[0] ?? "";
  const h = raw.toLowerCase();
  if (h === "runway" || h === "simulator") return "runway";
  if (h === "playbooks" || h === "crisis" || h === "resilience" || h === "worst-extreme-liquidity")
    return "playbooks";
  if (h === "tools" || h === "investor-email" || h === "deadlines") return "tools";
  if (h === "overview" || h === "") return "overview";
  return "overview";
}

export function useHashTab(): [TabId, (t: TabId) => void] {
  const [tab, setTabState] = useState<TabId>(() =>
    typeof window !== "undefined" ? tabFromHash(window.location.hash) : "overview"
  );

  useEffect(() => {
    const sync = () => setTabState(tabFromHash(window.location.hash));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const setTab = useCallback((t: TabId) => {
    const next = HASH[t];
    const cur = window.location.hash;
    const bothOverview =
      t === "overview" && (cur === "" || cur === "#" || cur === "#overview");
    if (cur === next || bothOverview) {
      setTabState(t);
      return;
    }
    window.location.hash = next;
    queueMicrotask(() => setTabState(tabFromHash(window.location.hash)));
  }, []);

  return [tab, setTab];
}
