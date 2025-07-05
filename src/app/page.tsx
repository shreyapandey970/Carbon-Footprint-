"use client";

import { useState, useEffect } from "react";
import type { CarbonData } from "@/types";
import type { ReductionSuggestionsOutput } from "@/ai/flows/reduction-suggestions";
import { Header } from "@/components/Header";
import { DataInputForm } from "@/components/DataInputForm";
import { FootprintChart } from "@/components/FootprintChart";
import { ReductionSuggestions } from "@/components/ReductionSuggestions";
import { Card, CardContent } from "@/components/ui/card";
import { getReductionStrategies } from "@/lib/actions";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [carbonData, setCarbonData] = useState<CarbonData | null>(null);
  const [suggestions, setSuggestions] =
    useState<ReductionSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedData = localStorage.getItem("carbonData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setCarbonData(parsedData);
    }
  }, []);

  const handleDataSubmit = async (data: CarbonData) => {
    setIsLoading(true);
    setCarbonData(data);
    setSuggestions(null);
    if (isMounted) {
      localStorage.setItem("carbonData", JSON.stringify(data));
    }
    try {
      const result = await getReductionStrategies(data);
      setSuggestions(result);
    } catch (error) {
      console.error("Failed to get reduction suggestions:", error);
      // Optionally, show a toast notification for the error
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid gap-8">
          <DataInputForm
            onSubmit={handleDataSubmit}
            initialData={carbonData}
            isProcessing={isLoading}
          />

          {carbonData && (
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in-50 duration-500">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 text-primary">Footprint Visualization</h2>
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
              <ReductionSuggestions
                suggestions={suggestions}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} CarbonWise Footprint. All Rights Reserved.
      </footer>
    </div>
  );
}
