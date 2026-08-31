"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  className?: string;
  maxHeight?: string;
}

export function CodeBlock({ code, className, maxHeight }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        "overflow-auto rounded-lg bg-[#0a0a0f] p-4 font-mono text-xs leading-relaxed text-session-2",
        className
      )}
      style={{ maxHeight }}
    >
      <code>{code}</code>
    </pre>
  );
}
