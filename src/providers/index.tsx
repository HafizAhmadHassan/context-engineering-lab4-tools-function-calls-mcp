"use client";

import * as React from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { LabProvider } from "@/providers/lab-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LabProvider>{children}</LabProvider>
    </ThemeProvider>
  );
}
