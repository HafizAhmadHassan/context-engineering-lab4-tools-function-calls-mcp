import * as React from "react";

interface PhaseHeaderProps {
  badge: string;
  title: string;
  duration?: string;
  description: string;
}

export function PhaseHeader({ badge, title, duration, description }: PhaseHeaderProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary">
          {badge}
        </span>
        <h2 className="text-xl font-bold">{title}</h2>
        {duration && (
          <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-muted text-muted-foreground">
            {duration}
          </span>
        )}
      </div>
      <p className="text-sm text-foreground/70">{description}</p>
    </div>
  );
}
