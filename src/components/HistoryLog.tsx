"use client";

import type { HistoryEntry } from "@/types";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { History } from "lucide-react";

interface HistoryLogProps {
  history: HistoryEntry[];
}

export function HistoryLog({ history }: HistoryLogProps) {
  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl"><History className="h-6 w-6" /> Calculation History</CardTitle>
          <CardDescription>Your past calculations will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center text-sm text-muted-foreground h-24 border-2 border-dashed rounded-lg">
            No history yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl"><History className="h-6 w-6" /> Calculation History</CardTitle>
        <CardDescription>Review your past carbon footprint calculations.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {history.map((entry) => (
            <AccordionItem value={entry.id} key={entry.id}>
              <AccordionTrigger>
                <div className="flex justify-between w-full pr-4">
                    <span className="font-semibold truncate">{entry.companyName}</span>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{format(new Date(entry.timestamp), "PPp")}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Total Emissions:</strong> {entry.totalEmissions.toFixed(2)} tCO₂e</p>
                  <p><strong>Carbon Score:</strong> {entry.carbonScore}</p>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <p><strong>Scope 1:</strong> {entry.scope1Emissions} tCO₂e</p>
                    <p><strong>Scope 2:</strong> {entry.scope2Emissions} tCO₂e</p>
                    <p><strong>Scope 3:</strong> {entry.scope3Emissions} tCO₂e</p>
                    <p><strong>Energy:</strong> {entry.energyConsumption} kWh</p>
                    <p><strong>Travel:</strong> {entry.travelEmissions} tCO₂e</p>
                    <p><strong>Waste:</strong> {entry.wasteEmissions} tCO₂e</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
