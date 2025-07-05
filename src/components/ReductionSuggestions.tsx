"use client";

import { useState } from "react";
import type { ReductionSuggestionsOutput } from "@/ai/flows/reduction-suggestions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getSpeechFromText } from "@/lib/actions";
import { CheckCircle, Speaker, Loader2 } from "lucide-react";

interface ReductionSuggestionsProps {
  suggestions: ReductionSuggestionsOutput | null;
  isLoading: boolean;
}

export function ReductionSuggestions({ suggestions, isLoading }: ReductionSuggestionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">AI-Powered Insights</CardTitle>
        <CardDescription>Custom recommendations to reduce your carbon footprint.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingState />}
        {!isLoading && suggestions && <SuggestionsDisplay suggestions={suggestions} />}
        {!isLoading && !suggestions && <InitialState />}
      </CardContent>
    </Card>
  );
}

const LoadingState = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

const InitialState = () => (
    <div className="flex flex-col items-center justify-center h-64 text-center bg-secondary rounded-lg p-4">
        <p className="text-muted-foreground">Your reduction suggestions will appear here after calculation.</p>
    </div>
)

const SuggestionsDisplay = ({ suggestions }: { suggestions: ReductionSuggestionsOutput }) => {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isReadingAloud, setIsReadingAloud] = useState(false);

  const handleReadAloud = async () => {
    setIsReadingAloud(true);
    setAudioSrc(null);
    try {
      const result = await getSpeechFromText(suggestions.overallAssessment);
      if (result?.media) {
        setAudioSrc(result.media);
      }
    } catch (error) {
      console.error("Failed to generate speech:", error);
      // Optionally, show a toast notification for the error
    } finally {
      setIsReadingAloud(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-primary">Overall Assessment</h3>
          <Button variant="ghost" size="icon" onClick={handleReadAloud} disabled={isReadingAloud} title="Read aloud">
            {isReadingAloud ? <Loader2 className="h-5 w-5 animate-spin" /> : <Speaker className="h-5 w-5" />}
            <span className="sr-only">Read assessment aloud</span>
          </Button>
        </div>
        <p className="text-muted-foreground mt-1">{suggestions.overallAssessment}</p>
        {audioSrc && (
          <audio controls autoPlay className="mt-4 w-full" key={audioSrc}>
            <source src={audioSrc} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-lg text-primary">Reduction Strategies</h3>
        <ul className="space-y-3 mt-2">
          {suggestions.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
              <span className="text-foreground">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
