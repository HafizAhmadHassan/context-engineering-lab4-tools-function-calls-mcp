"use client";

import * as React from "react";
import { CircleCheckBig, Play, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhaseHeader } from "@/components/phase-header";
import { PhaseTabs } from "@/components/ui/phase-tabs";
import { CodeBlock } from "@/components/ui/code-block";
import {
  mcpTools,
  mcpResources,
  mcpPrompts,
  serverConfig,
  transportsData,
} from "@/lib/mcp-data";

const MAIN_TABS = [
  "Architecture",
  "Server Builder",
  "Message Flow",
  "Transports",
] as const;

const PRIMITIVES = [
  { name: "Tools", controlledBy: "Server" },
  { name: "Resources", controlledBy: "Client" },
  { name: "Prompts", controlledBy: "Client" },
];

export function Phase2({ onComplete }: { onComplete: () => void }) {
  const [tab, setTab] = React.useState<string>("Architecture");
  const [primitive, setPrimitive] = React.useState(0);

  return (
    <div className="space-y-6">
      <PhaseHeader
        badge="Phase 2"
        title="MCP Server Simulation"
        description="Explore the Model Context Protocol architecture, build a server configuration, and watch JSON-RPC messages flow between client and server."
      />

      <PhaseTabs tabs={MAIN_TABS} active={tab} onChange={setTab} />

      {tab === "Architecture" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold mb-4">MCP Architecture</h3>
            <div className="flex items-center justify-center gap-4 mb-6">
              <ArchNode
                title="Host"
                subtitle="The application the user interacts with (e.g., Claude Desktop)"
              />
              <ArrowRight />
              <ArchNode
                title="Client"
                subtitle="Maintains a 1:1 connection with an MCP server"
              />
              <ArrowRight />
              <ArchNode
                title="Server"
                subtitle="Exposes tools, resources, and prompts via the MCP protocol"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold mb-4">The Three MCP Primitives</h3>
            <p className="text-sm text-foreground/70 mb-4">
              Click each primitive to learn who controls it and see examples.
            </p>
            <div className="flex gap-2 mb-4">
              {PRIMITIVES.map((p, i) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setPrimitive(i)}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer border",
                    primitive === i
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-muted text-muted-foreground hover:text-foreground border-transparent"
                  )}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Controlled by:</span>
              <span className="font-medium text-secondary">
                {PRIMITIVES[primitive].controlledBy}
              </span>
            </div>
          </div>
        </div>
      )}

      {tab === "Server Builder" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold mb-4">Tools</h3>
            <div className="grid gap-2 md:grid-cols-2">
              {mcpTools.map((t) => (
                <div key={t.name} className="rounded-lg border border-border bg-muted/40 p-3">
                  <div className="font-mono text-sm text-primary">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold mb-4">Resources</h3>
            <div className="flex flex-wrap gap-2">
              {mcpResources.map((r) => (
                <span key={r.uri} className="rounded-md bg-primary/10 text-primary font-mono text-xs px-2 py-1">
                  {r.uri}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold mb-4">Prompts</h3>
            <div className="flex flex-wrap gap-2">
              {mcpPrompts.map((p) => (
                <span key={p.name} className="rounded-md bg-secondary/10 text-secondary font-mono text-xs px-2 py-1">
                  {p.name}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <span className="text-xs text-muted-foreground font-mono">json</span>
            </div>
            <CodeBlock code={serverConfig} maxHeight="360px" />
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-2">
              <CircleCheckBig className="h-4 w-4 text-green-500" />
              <span className="text-sm font-semibold">Config Score</span>
            </div>
            <p className="text-sm text-foreground/70 mt-1">
              5 / 5 • Well-configured server with balanced capabilities!
            </p>
          </div>
        </div>
      )}

      {tab === "Message Flow" && <MessageFlow />}

      {tab === "Transports" && (
        <div className="space-y-4">
          {transportsData.map((t) => (
            <div key={t.name} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">{t.name}</h3>
                <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {t.mode}
                </span>
              </div>
              <p className="text-sm text-foreground/70 mb-4">{t.description}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                  <div className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">ADVANTAGES</div>
                  <ul className="space-y-1 text-xs text-foreground/80">
                    {t.pros.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="text-green-500">+</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                  <div className="text-xs font-medium text-red-500 mb-2">LIMITATIONS</div>
                  <ul className="space-y-1 text-xs text-foreground/80">
                    {t.cons.map((c) => (
                      <li key={c} className="flex gap-2">
                        <span className="text-red-500">−</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4">
                <span className="text-xs font-medium text-secondary">Best for </span>
                <span className="text-xs text-foreground/80">{t.use}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onComplete}
          className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 cursor-pointer bg-primary text-primary-foreground hover-glow-purple hover:brightness-110 px-6 py-3 text-base"
        >
          <Wrench className="h-4 w-4" />
          Complete Phase 2
        </button>
      </div>
    </div>
  );
}

function ArrowRight() {
  return <div className="text-muted-foreground px-2">→</div>;
}

function ArchNode({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex-1 max-w-[220px] rounded-xl border border-border bg-muted/40 p-4 text-center">
      <div className="text-sm font-semibold mb-1">{title}</div>
      <div className="text-[10px] text-muted-foreground text-center">{subtitle}</div>
    </div>
  );
}

function MessageFlow() {
  const [view, setView] = React.useState("Initialization Handshake");
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["Initialization Handshake", "Tool Call Flow"].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer border",
              view === v
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-muted text-muted-foreground hover:text-foreground border-transparent"
            )}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">{view}</h3>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:brightness-110 transition-all"
          >
            <Play className="h-3 w-3" />
            Play
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-center text-sm font-medium">
            Client
          </div>
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-center text-sm font-medium">
            Server
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Click &quot;Play&quot; to see the message flow
        </p>
      </div>
    </div>
  );
}


