"use client";

import { useState, useCallback, useMemo } from "react";
import type { Deal, DealStage, PipelineStage } from "./types";
import { DEAL_STAGES } from "./constants";

/** Group deals into pipeline stages */
export function usePipeline(deals: Deal[]) {
  const stages = useMemo<PipelineStage[]>(() =>
    DEAL_STAGES.map((stage) => {
      const stageDeals = deals.filter((d) => d.stage === stage.id);
      return {
        id: stage.id,
        name: stage.name,
        color: stage.color,
        deals: stageDeals,
        totalValue: stageDeals.reduce((sum, d) => sum + d.value, 0),
      };
    }),
    [deals],
  );

  const totalValue = useMemo(() => deals.filter((d) => d.stage !== "lost").reduce((sum, d) => sum + d.value * (d.probability / 100), 0), [deals]);
  const wonValue = useMemo(() => deals.filter((d) => d.stage === "won").reduce((sum, d) => sum + d.value, 0), [deals]);

  return { stages, totalValue, wonValue };
}

/** Contact filter state */
export function useContactFilters() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("name");

  const params = useMemo(() => {
    const p: Record<string, string> = {};
    if (search) p.search = search;
    if (status) p.status = status;
    if (tags.length) p.tags = tags.join(",");
    p.sortBy = sortBy;
    return p;
  }, [search, status, tags, sortBy]);

  const reset = useCallback(() => { setSearch(""); setStatus(null); setTags([]); setSortBy("name"); }, []);

  return { search, setSearch, status, setStatus, tags, setTags, sortBy, setSortBy, params, reset };
}
