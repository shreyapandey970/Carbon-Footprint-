"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { LucideProps } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface Badge {
  name: string;
  icon: React.ComponentType<LucideProps>;
  unlocked: boolean;
  description: string;
}

interface BadgesProps {
  badges: Badge[];
}

export function Badges({ badges }: BadgesProps) {
  if (!badges || badges.length === 0) return null;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Your Badges</CardTitle>
        <CardDescription>Achievements from your latest data.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center">
        <TooltipProvider>
            <div className="flex flex-wrap gap-4 justify-center">
            {badges.map((badge) => (
                <Tooltip key={badge.name}>
                <TooltipTrigger asChild>
                    <div className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${badge.unlocked ? 'border-accent bg-accent/20 scale-100' : 'border-dashed opacity-50 scale-95'}`}>
                        <badge.icon className={`h-8 w-8 ${badge.unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-xs font-semibold">{badge.name}</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{badge.description}</p>
                </TooltipContent>
                </Tooltip>
            ))}
            </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
