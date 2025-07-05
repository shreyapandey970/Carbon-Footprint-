import { LeafIcon } from "@/components/icons";

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <LeafIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">
            CarbonWise Footprint
          </h1>
        </div>
      </div>
    </header>
  );
}
