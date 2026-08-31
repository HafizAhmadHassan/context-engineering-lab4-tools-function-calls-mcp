import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-sm">Loading lab&hellip;</span>
      </div>
    </div>
  );
}
