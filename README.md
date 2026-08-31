# Day 4: Tools, Function Calling & MCP — Context Engineering Workshop

An independent, from-scratch recreation of the `day4-unified-lab.vercel.app`
interactive workshop interface. It covers **tool schemas**, **function
calling**, **MCP (Model Context Protocol)** server simulation, and
**ReAct agent loops** through four sequential phases with a space-mission
("AstroLog") theme.

> Rebuilt from observation only. No proprietary source code was copied. All
> data, tool execution, and reasoning flows are **mocked** locally with
> realistic sample data.

---

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **lucide-react** icons, **clsx** + **tailwind-merge**

---

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000 (or the port printed in the terminal).

Production build + preview:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

---

## Environment variables

**None required.** All data is served from local mock modules
(`src/lib/*-data.ts`). No backend, database, or external service is used. API
keys entered in the UI (Gemini / OpenAI) are stored only in the browser's
`localStorage` and are optional — they are never sent anywhere.

---

## Implemented routes

| Route        | Description                                          |
| ------------ | ---------------------------------------------------- |
| `/`          | Landing (pre-start) → phase-based workshop interface |
| `/_not-found`| Next.js generated 404 page                            |

The workshop is a single page driven by client state (`src/providers/`). Before
clicking **Start the lab** you see the overview + lab cards; afterwards a
4-phase stepper and the active phase are shown. Phases unlock sequentially.

---

## Project structure

```
src/
  |-- app/
  |     |-- page.tsx         orchestrator (landing → phase view, progression)
  |     |-- layout.tsx       root layout (fonts, metadata, providers)
  |     |-- globals.css      Tailwind v4 + design tokens + custom utilities
  |     |-- loading.tsx      loading fallback
  |-- providers/
  |     |-- index.tsx        client providers wrapper
  |     |-- theme-provider.tsx  dark/light theme (localStorage persisted)
  |     |-- lab-provider.tsx    phase state, API keys, canAccess gating
  |-- components/
  |     |-- header.tsx           title bar + API key + theme toggle
  |     |-- api-keys-modal.tsx   Gemini/OpenAI inputs (localStorage)
  |     |-- landing-page.tsx     pre-start overview + lab cards
  |     |-- phase-stepper.tsx    Phase 1–4 progress bar with lock states
  |     |-- phase-header.tsx     badge / title / duration / description
  |     |-- phases/
  |     |     |-- phase1.tsx   Tool Schemas (4 sub-tabs + 4 tool tabs)
  |     |     |-- phase2.tsx   MCP Server (4 sub-tabs, config, message flow)
  |     |     |-- phase3.tsx   ReAct Loop (3 scenarios + reasoning comparison)
  |     |     |-- phase4.tsx   Synthesis (results, takeaways, Day 5 preview)
  |     |-- ui/
  |     |     |-- phase-tabs.tsx  tab bar (scrollable on mobile)
  |     |     |-- code-block.tsx  JSON/code display
  |-- lib/
        |-- utils.ts                   cn() helper
        |-- astrolog-data.ts           missions, crew, weather sample data
        |-- tool-schema-data.ts        vague vs well-designed schemas ×4 tools
        |-- design-principles-data.ts  6 design principles
        |-- jit-data.ts                JIT instruction examples
        |-- mcp-data.ts                MCP server config, transports
        |-- react-scenarios-data.ts    ReAct scenario step-by-step traces
```

Path alias `@/*` → `./src/*` (see `tsconfig.json`).

---

## How the phases work

1. **Phase 1 — Tool Schema Design** (`~20 min`): Schema Comparison (Vague
   vs Well-Designed across Mission Search / Crew Schedule / Cargo Manifest /
   Fuel Estimate, with a live Schema Score), Design Principles (interactive
   6-item checklist), JIT Instructions, and the Tool Lifecycle Pipeline.
2. **Phase 2 — MCP Server Simulation**: Architecture (Host→Client→Server and
   the three primitives), Server Builder (tools/resources/prompts + generated
   JSON config with a score), Message Flow (client/server JSON-RPC view), and
   Transports (stdio vs HTTP+SSE comparison).
3. **Phase 3 — ReAct Agent Loop** (`~15 min`): three step-through scenarios
   (Basic Lookup, Multi-Step Planning, Error Recovery) with cumulative token
   cost, plus a reasoning comparison with and without explicit Thought steps.
4. **Phase 4 — Synthesis**: score summary, key takeaways, and a Day 5 preview.

---

## Features that are mocked (not connected to real services)

| Feature                    | Mocked behavior                                                              |
| -------------------------- | ---------------------------------------------------------------------------- |
| **MCP server**             | Client-side simulator; tool calls resolve against local data                 |
| **Mission database**       | Hard-coded in `src/lib/*` (missions, crew, weather, cargo, fuel)              |
| **LLM / function calling** | Tool execution is scripted/pre-determined; API keys are stored but not used  |
| **ReAct agent loop**       | Pre-scripted Thought → Action → Observation → Answer traces                  |
| **Schema comparison**      | Static JSON schema blocks with a client-computed Schema Score                |
| **MCP transports / message flow** | Static comparison + simulated view                                     |

Everything is deterministic and runs purely on the client — no backend needed,
so the site is fully usable for demonstration.

---

## Deployment — Vercel

The project is a standard Next.js App Router app and needs **no configuration**.

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Vercel, choose **New Project** and import the repo.
3. Vercel auto-detects the **Next.js** framework preset
   (build `next build`, output `.next`). No env vars required.
4. Click **Deploy**.

Or deploy from the CLI:

```bash
npm i -g vercel
vercel
```

The site supports both **desktop** and **mobile** layouts out of the box.

---

*Not affiliated with the original project. Educational recreation only.*
