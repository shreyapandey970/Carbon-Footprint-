"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TreeDeciduous } from "lucide-react";

interface VirtualForestProps {
  trees: number;
}

export function VirtualForest({ trees }: VirtualForestProps) {
  const displayedTrees = Math.min(trees, 50); // Cap displayed trees for performance

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Your Virtual Forest</CardTitle>
        <CardDescription>You've planted {trees} {trees === 1 ? 'tree' : 'trees'} by reducing emissions!</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center p-6">
        {trees === 0 ? (
          <div className="text-center text-muted-foreground">
            <p>Reduce your emissions from your last calculation to plant trees.</p>
          </div>
        ) : (
            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-5 lg:grid-cols-7 gap-2">
            {Array.from({ length: displayedTrees }).map((_, index) => (
              <TreeDeciduous key={index} className="h-8 w-8 text-success" />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
