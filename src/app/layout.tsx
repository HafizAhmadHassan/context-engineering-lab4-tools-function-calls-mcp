import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers";

export const metadata: Metadata = {
  title: "Day 4: Tools, Function Calling & MCP — Context Engineering Workshop",
  description:
    "Design tool schemas, simulate MCP servers, and build ReAct agent loops",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
