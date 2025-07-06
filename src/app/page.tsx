"use client";

import { useState, useEffect } from "react";
import type { CarbonData, HistoryEntry, CarbonForecastData } from "@/types";
import type { ReductionSuggestionsOutput } from "@/ai/flows/reduction-suggestions";
import { Header } from "@/components/Header";
import { DataInputForm } from "@/components/DataInputForm";
import { FootprintChart } from "@/components/FootprintChart";
import { ReductionSuggestions } from "@/components/ReductionSuggestions";
import { CarbonScore } from "@/components/CarbonScore";
import { Badges } from "@/components/Badges";
import { HistoryLog } from "@/components/HistoryLog";
import { VirtualForest } from "@/components/VirtualForest";
import { CarbonForecast } from "@/components/CarbonForecast";
import { Card, CardContent } from "@/components/ui/card";
import { getReductionStrategies, getForecast } from "@/lib/actions";
import { Award, Zap, Bike, Trash2 } from "lucide-react";

export default function Home() {
  const [carbonData, setCarbonData] = useState<CarbonData | null>(null);
  const [suggestions, setSuggestions] =
    useState<ReductionSuggestionsOutput | null>(null);
  const [forecastData, setForecastData] = useState<CarbonForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [treeCount, setTreeCount] = useState(0);

  useEffect(() => {
    const savedHistory = localStorage.getItem("carbonHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    const savedTrees = localStorage.getItem("treeCount");
    if (savedTrees) {
        setTreeCount(JSON.parse(savedTrees));
    }
  }, []);

  const handleDataSubmit = async (data: CarbonData) => {
    setIsLoading(true);
    setCarbonData(data);
    setSuggestions(null);
    setForecastData(null);

    const totalEmissions = data.scope1Emissions + data.scope2Emissions + data.scope3Emissions;
    const carbonScore = Math.max(0, Math.round(1000 - totalEmissions / 5));
    const newHistoryEntry: HistoryEntry = {
        ...data,
        id: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        totalEmissions,
        carbonScore,
    };
    
    // Tree planting logic
    const previousEmissions = history.length > 0 ? history[0].totalEmissions : null;
    if (previousEmissions !== null && totalEmissions < previousEmissions) {
        const reduction = previousEmissions - totalEmissions;
        const newTrees = Math.floor(reduction / 10); // 1 tree per 10 tCO₂e reduced
        if (newTrees > 0) {
            const updatedTreeCount = treeCount + newTrees;
            setTreeCount(updatedTreeCount);
            localStorage.setItem("treeCount", JSON.stringify(updatedTreeCount));
        }
    }

    setHistory(prevHistory => {
        const updatedHistory = [newHistoryEntry, ...prevHistory].slice(0, 10);
        localStorage.setItem("carbonHistory", JSON.stringify(updatedHistory));
        return updatedHistory;
    });

    try {
       const [suggestionsResult, forecastResult] = await Promise.all([
        getReductionStrategies(data),
        getForecast(data)
      ]);
      setSuggestions(suggestionsResult);
      setForecastData(forecastResult);
    } catch (error) {
      console.error("Failed to get AI insights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = carbonData
    ? [
        { name: "Scope 1", value: carbonData.scope1Emissions, fill: "#3b82f6" },
        { name: "Scope 2", value: carbonData.scope2Emissions, fill: "#f97316" },
        { name: "Scope 3", value: carbonData.scope3Emissions, fill: "#facc15" },
      ].filter(d => d.value > 0)
    : [];

  const totalEmissions = carbonData ? carbonData.scope1Emissions + carbonData.scope2Emissions + carbonData.scope3Emissions : 0;
  const carbonScore = carbonData ? Math.max(0, Math.round(1000 - totalEmissions / 5)) : null;

  const badges = carbonData ? [
    { name: 'Eco-Beginner', icon: Award, unlocked: totalEmissions > 0, description: 'Calculated your first footprint.' },
    { name: 'Energy Saver', icon: Zap, unlocked: totalEmissions > 0 && carbonData.energyConsumption < 10000, description: 'Low energy consumption (below 10,000 kWh).' },
    { name: 'Green Commuter', icon: Bike, unlocked: totalEmissions > 0 && carbonData.travelEmissions < 5, description: 'Low travel emissions (below 5 tCO₂e).' },
    { name: 'Waste Reducer', icon: Trash2, unlocked: totalEmissions > 0 && carbonData.wasteEmissions < 2, description: 'Low waste emissions (below 2 tCO₂e).' },
  ] : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <DataInputForm
              onSubmit={handleDataSubmit}
              isProcessing={isLoading}
            />
            <HistoryLog history={history} />
          </div>
          <div className="lg:col-span-3">
            {carbonData ? (
              <div className="space-y-8 animate-in fade-in-50 duration-500">
                <div className="grid md:grid-cols-2 gap-8">
                  <CarbonScore score={carbonScore} />
                  <Badges badges={badges} />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold text-primary">Footprint Visualization</h2>
                      <p className="text-muted-foreground mb-6">A breakdown of your company's carbon emissions by scope.</p>
                      {chartData.length > 0 ? (
                        <FootprintChart data={chartData} />
                      ) : (
                        <div className="flex items-center justify-center h-64 bg-secondary rounded-lg">
                          <p className="text-muted-foreground">Enter emission data to see the chart.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  <VirtualForest trees={treeCount} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ReductionSuggestions
                        suggestions={suggestions}
                        isLoading={isLoading}
                    />
                    <CarbonForecast
                        forecast={forecastData}
                        isLoading={isLoading}
                    />
                </div>
              </div>
            ) : (
               <div className="flex items-center justify-center h-full bg-card rounded-lg p-8 border-dashed border-2">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-primary mb-2">Welcome to your Dashboard</h2>
                    <p className="text-muted-foreground">Enter your data on the left to calculate your carbon footprint and unlock your personalized insights.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground mt-8">
        © {new Date().getFullYear()} CarbonWise Footprint. All Rights Reserved.
      </footer>
    </div>
  );
}
