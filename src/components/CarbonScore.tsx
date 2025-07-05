"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface CarbonScoreProps {
  score: number | null;
}

export function CarbonScore({ score }: CarbonScoreProps) {
  if (score === null) return null;

  const getScoreColor = () => {
    if (score > 750) return "text-success";
    if (score > 500) return "text-warning";
    return "text-destructive";
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Carbon Score</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        <div className={`text-5xl font-bold text-center ${getScoreColor()}`}>{score}</div>
        <p className="text-xs text-muted-foreground text-center mt-2">A higher score is better. Aim for 1000!</p>
      </CardContent>
    </Card>
  );
}
