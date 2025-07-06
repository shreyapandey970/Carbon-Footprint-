"use client";

import type { CarbonForecastData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

interface CarbonForecastProps {
  forecast: CarbonForecastData | null;
  isLoading: boolean;
}

export function CarbonForecast({ forecast, isLoading }: CarbonForecastProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-primary"><TrendingUp />Carbon Forecast</CardTitle>
        <CardDescription>An AI-powered projection of your future emissions.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingState />}
        {!isLoading && forecast && <ForecastDisplay forecast={forecast} />}
        {!isLoading && !forecast && <InitialState />}
      </CardContent>
    </Card>
  );
}

const LoadingState = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-4/5" />
  </div>
);

const InitialState = () => (
  <div className="flex flex-col items-center justify-center h-48 text-center bg-secondary rounded-lg p-4">
    <p className="text-muted-foreground">Your emissions forecast will appear here.</p>
  </div>
);

const ForecastDisplay = ({ forecast }: { forecast: CarbonForecastData }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg text-primary">{forecast.forecastPeriod} Projection</h3>
        <p className="text-4xl font-bold text-primary/80 mt-1">
            {forecast.forecastedEmissions.toFixed(2)} <span className="text-lg font-medium">tCO₂e</span>
        </p>
      </div>
       <div>
        <h3 className="font-semibold text-lg text-primary">Analysis</h3>
        <p className="text-muted-foreground mt-1">{forecast.analysis}</p>
      </div>
    </div>
  );
};
