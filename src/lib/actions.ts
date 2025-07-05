'use server';
import { suggestMetrics } from "@/ai/flows/suggest-metrics";
import { suggestReductionStrategies } from "@/ai/flows/reduction-suggestions";
import type { CarbonData } from "@/types";

export async function getMetricSuggestions(data: { industrySector: string }) {
  try {
    const result = await suggestMetrics(data);
    return result;
  } catch (error) {
    console.error("Error getting metric suggestions:", error);
    throw new Error("Failed to get AI-powered metric suggestions.");
  }
}

export async function getReductionStrategies(data: CarbonData) {
  try {
    const result = await suggestReductionStrategies(data);
    return result;
  } catch (error) {
    console.error("Error getting reduction strategies:", error);
    throw new Error("Failed to get AI-powered reduction strategies.");
  }
}
