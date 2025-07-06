"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CloudFog, Sprout, Trees } from "lucide-react";

interface CarbonScoreProps {
  score: number | null;
}

export function CarbonScore({ score }: CarbonScoreProps) {
  if (score === null) return null;

  let AvatarIcon;
  let avatarColor;
  let description;

  if (score < 500) {
    AvatarIcon = CloudFog;
    avatarColor = "text-destructive";
    description = "Room for improvement. Your avatar is a bit gloomy.";
  } else if (score < 750) {
    AvatarIcon = Sprout;
    avatarColor = "text-warning";
    description = "On the right track! Your avatar is sprouting.";
  } else {
    AvatarIcon = Trees;
    avatarColor = "text-success";
    description = "Excellent! You're an eco-champion.";
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Carbon Score & Avatar</CardTitle>
        <CardDescription>Your avatar evolves with your score.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center gap-4 text-center">
        <AvatarIcon className={`h-24 w-24 transition-all ${avatarColor}`} />
        <div className={`text-5xl font-bold ${avatarColor}`}>{score}</div>
        <p className="text-xs text-muted-foreground px-4">{description}</p>
      </CardContent>
    </Card>
  );
}
