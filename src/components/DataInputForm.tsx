"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { CarbonData } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Lightbulb, Zap, Plane, Trash2 } from "lucide-react";
import { getMetricSuggestions } from "@/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industrySector: z.string().min(1, "Industry sector is required"),
  scope1Emissions: z.coerce.number().min(0, "Must be a positive number"),
  scope2Emissions: z.coerce.number().min(0, "Must be a positive number"),
  scope3Emissions: z.coerce.number().min(0, "Must be a positive number"),
  energyConsumption: z.coerce.number().min(0, "Must be a positive number"),
  travelEmissions: z.coerce.number().min(0, "Must be a positive number"),
  wasteEmissions: z.coerce.number().min(0, "Must be a positive number"),
});

interface DataInputFormProps {
  onSubmit: (data: CarbonData) => void;
  isProcessing: boolean;
}

export function DataInputForm({ onSubmit, isProcessing }: DataInputFormProps) {
  const [suggestedMetrics, setSuggestedMetrics] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      industrySector: "",
      scope1Emissions: 0,
      scope2Emissions: 0,
      scope3Emissions: 0,
      energyConsumption: 0,
      travelEmissions: 0,
      wasteEmissions: 0,
    },
  });
  
  const industrySector = form.watch("industrySector");

  const handleSuggestMetrics = async () => {
    if (!industrySector) {
      form.setError("industrySector", { message: "Please enter an industry first." });
      return;
    }
    setIsSuggesting(true);
    setSuggestedMetrics([]);
    try {
      const result = await getMetricSuggestions({ industrySector });
      setSuggestedMetrics(result.suggestedMetrics);
    } catch (error) {
      console.error("Failed to get metric suggestions:", error);
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Carbon Data Input</CardTitle>
        <CardDescription>Enter your company's operational data to calculate its carbon footprint.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
               <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. EcoCorp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="industrySector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry Sector</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="e.g. Manufacturing, Technology" {...field} />
                        <Button type="button" onClick={handleSuggestMetrics} disabled={isSuggesting || !industrySector}>
                          {isSuggesting ? <Loader2 className="animate-spin" /> : <Lightbulb />}
                          <span className="ml-2 hidden sm:inline">Suggest Metrics</span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Get AI-powered suggestions for relevant metrics to track.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {suggestedMetrics.length > 0 && (
                <Alert className="bg-accent/30">
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Suggested Metrics</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside mt-2">
                      {suggestedMetrics.map((metric, index) => (
                        <li key={index}>{metric}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Separator />
            
            <div className="grid md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="scope1Emissions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Zap className="text-accent" />Scope 1 Emissions (tCO₂e)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormDescription>Direct emissions from owned sources.</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scope2Emissions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Zap className="text-accent"/>Scope 2 Emissions (tCO₂e)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormDescription>Indirect emissions from purchased energy.</FormDescription>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="scope3Emissions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Zap className="text-accent"/>Scope 3 Emissions (tCO₂e)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormDescription>All other indirect emissions.</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="energyConsumption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Zap className="text-accent"/>Energy Consumption (kWh)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                     <FormDescription>Total energy usage.</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="travelEmissions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Plane className="text-accent"/>Travel Emissions (tCO₂e)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                     <FormDescription>From business travel.</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wasteEmissions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Trash2 className="text-accent"/>Waste Emissions (tCO₂e)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                     <FormDescription>From waste generation.</FormDescription>
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isProcessing ? "Analyzing..." : "Calculate & Get Suggestions"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
