'use server';
import { suggestMetrics } from "@/ai/flows/suggest-metrics";
import { suggestReductionStrategies } from "@/ai/flows/reduction-suggestions";
import { getSpeechAudio } from "@/ai/flows/text-to-speech";
import { getCarbonForecast } from "@/ai/flows/forecast-emissions";
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

export async function getSpeechFromText(text: string) {
  try {
    const result = await getSpeechAudio(text);
    return result;
  } catch (error) {
    console.error("Error getting speech from text:", error);
    throw new Error("Failed to get AI-powered speech synthesis.");
  }
}

export async function getForecast(data: CarbonData) {
    try {
        const result = await getCarbonForecast(data);
        return result;
    } catch (error) {
        console.error("Error getting carbon forecast:", error);
        throw new Error("Failed to get AI-powered carbon forecast.");
    }
}
