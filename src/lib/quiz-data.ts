export interface QuizOption {
  label: string;
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  section: string;
  difficulty: "easy" | "medium" | "hard" | "tricky";
}

export const SECTION_COLORS: Record<string, string> = {
  "Tool Fundamentals & Schema Design": "#60a5fa",
  "JIT Instructions & Safety": "#f97316",
  "ReAct Pattern & Agent Behavior": "#a855f7",
  "MCP Architecture & Protocol": "#22d3ee",
  "Production Concerns": "#facc15",
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    "id": 1,
    "question": "In the tool lifecycle pipeline (DESCRIBE → DECIDE → CALL → RETURN → REASON), which stage is most impacted by schema quality?",
    "options": [
      {
        "label": "A",
        "text": "CALL — the runtime validates inputs against the schema before executing the tool function"
      },
      {
        "label": "B",
        "text": "RETURN — the schema defines the output structure, so its quality determines response parseability"
      },
      {
        "label": "C",
        "text": "DECIDE — the LLM reads the schema to choose which tool to call and what arguments to pass"
      },
      {
        "label": "D",
        "text": "REASON — the model refers back to the schema when interpreting tool results for its answer"
      }
    ],
    "correctAnswer": "C",
    "explanation": "Schema quality has the highest impact on the DECIDE stage. The LLM reads tool descriptions, parameter names, types, and constraints to decide (1) whether to call a tool, (2) which tool to call, and (3) what arguments to provide. A vague description like 'Gets missions' gives the model no guidance on when to use it or what to pass. A clear description like 'Search the mission database by keyword, status, or destination — returns matching missions with crew and launch dates' guides precise decisions. CALL is runtime execution (not LLM), RETURN is tool output, and REASON benefits from JIT instructions rather than schemas.",
    "topic": "Tool Lifecycle",
    "section": "Tool Fundamentals & Schema Design",
    "difficulty": "medium"
  },
  {
    "id": 2,
    "question": "Which of these is the BEST tool name following function calling conventions?",
    "options": [
      {
        "label": "A",
        "text": "getMissionData"
      },
      {
        "label": "B",
        "text": "search_missions"
      },
      {
        "label": "C",
        "text": "MissionSearch"
      },
      {
        "label": "D",
        "text": "missions"
      }
    ],
    "correctAnswer": "B",
    "explanation": "The verb_noun (snake_case) convention is the standard for tool naming: 'search_missions' clearly communicates both the action (search) and the target (missions). 'getMissionData' uses camelCase (not the convention) and is vague about what data. 'missions' is a noun with no verb — the LLM doesn't know if it searches, lists, creates, or deletes missions. 'MissionSearch' uses PascalCase (class naming, not function naming) and reverses the verb-noun order. The verb-first pattern helps LLMs match user intent to tools: 'find Mars missions' → search_missions.",
    "topic": "Schema Design",
    "section": "Tool Fundamentals & Schema Design",
    "difficulty": "medium"
  },
  {
    "id": 3,
    "question": "A tool schema has 8 parameters, all marked as required. What is the most likely problem this will cause?",
    "options": [
      {
        "label": "A",
        "text": "The tool will execute slower because the runtime has to validate and process all 8 mandatory fields"
      },
      {
        "label": "B",
        "text": "The schema will consume too many tokens in the context window, leaving less room for user messages"
      },
      {
        "label": "C",
        "text": "The tool will be triggered too often because having more parameters matches a wider range of queries"
      },
      {
        "label": "D",
        "text": "The LLM will frequently hallucinate invalid arguments — more required parameters mean more guessing"
      }
    ],
    "correctAnswer": "D",
    "explanation": "Every parameter is a decision point where the LLM must infer the correct value from the user's query. With 8 required parameters, the model must hallucinate values for any parameter the user didn't mention — and all-required means it can't leave any blank. The best practice is: keep parameters under 5, mark only truly essential ones as required, and use sensible defaults for the rest. Optional parameters with clear descriptions let the model call the tool with partial information rather than guessing. This is a core context engineering principle: reduce the decision surface for the LLM.",
    "topic": "Schema Design",
    "section": "Tool Fundamentals & Schema Design",
    "difficulty": "medium"
  },
  {
    "id": 4,
    "question": "Why should tool schemas use enum constraints for parameters like 'status' instead of free-text strings?",
    "options": [
      {
        "label": "A",
        "text": "Enums reduce the schema byte size and make JSON validation faster at the server level"
      },
      {
        "label": "B",
        "text": "Enums prevent the LLM from hallucinating invalid values — the model picks from a predefined list"
      },
      {
        "label": "C",
        "text": "Enums are mandatory in the OpenAI function calling spec and omitting them causes validation errors"
      },
      {
        "label": "D",
        "text": "Enums let the tool skip server-side input validation since the schema guarantees correctness"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Without an enum, a model might pass 'active' when the valid values are 'planned', 'in-transit', 'completed', 'delayed', 'aborted'. Enum constraints in the schema communicate the exact valid options: the LLM sees them and constrains its output accordingly. This is context engineering at the schema level — you're shaping the model's decision space. Note: you should still validate inputs server-side (defense in depth), but enums dramatically reduce the frequency of invalid arguments, especially for status fields, categories, and other closed sets.",
    "topic": "Schema Design",
    "section": "Tool Fundamentals & Schema Design",
    "difficulty": "medium"
  },
  {
    "id": 5,
    "question": "What are JIT (Just-In-Time) instructions in the context of tool use?",
    "options": [
      {
        "label": "A",
        "text": "Instructions compiled at runtime to optimize tool execution speed and reduce call latency"
      },
      {
        "label": "B",
        "text": "A system prompt technique that lazy-loads tool descriptions only when the tool is about to be called"
      },
      {
        "label": "C",
        "text": "Instructions the user provides at query time to dynamically override the tool's default behavior"
      },
      {
        "label": "D",
        "text": "Guidance embedded in the tool's RETURN value that tells the LLM how to interpret and present the result"
      }
    ],
    "correctAnswer": "D",
    "explanation": "JIT instructions are injected INTO the tool's return payload (often as a '_jit_instructions' field). The LLM reads them alongside the data when composing its response. For example, a fuel estimation tool might return the data plus: '_jit_instructions: Note that the 15% safety margin is already included. If fuel > 50,000 kg, warn about heavy-lift vehicle requirement.' This technique lets tools dynamically influence LLM reasoning without changing the system prompt. It's especially powerful for safety-critical tools where the response must follow specific rules based on the data.",
    "topic": "JIT Instructions",
    "section": "JIT Instructions & Safety",
    "difficulty": "hard"
  },
  {
    "id": 6,
    "question": "You're designing a safety-critical fuel estimation tool. Should you put safety instructions in the tool SCHEMA description or as JIT instructions in the RETURN value?",
    "options": [
      {
        "label": "A",
        "text": "Both — general safety guidance in the schema, plus data-specific warnings in JIT return instructions"
      },
      {
        "label": "B",
        "text": "Schema description only — the model needs to internalize all safety rules before it calls the tool"
      },
      {
        "label": "C",
        "text": "Neither — safety rules belong exclusively in the system prompt where they receive the highest priority"
      },
      {
        "label": "D",
        "text": "JIT instructions only — safety guidance should always be dynamic and tied to the actual data returned"
      }
    ],
    "correctAnswer": "A",
    "explanation": "The best practice is defense-in-depth with both layers. The schema description should include general guidance ('always note the safety margin, suggest checking weather'). JIT instructions should include data-specific warnings that depend on the actual result — e.g., 'fuel > 50,000 kg → warn about heavy-lift requirement' or 'launch_safe=false → MUST state launch cannot proceed.' The schema provides always-on context; JIT instructions provide dynamic, data-dependent reasoning constraints. Relying on only one layer risks the model ignoring or forgetting the guidance when it matters most.",
    "topic": "Safety & Design",
    "section": "JIT Instructions & Safety",
    "difficulty": "hard"
  },
  {
    "id": 7,
    "question": "In the ReAct (Reason + Act) pattern, what is the purpose of the explicit 'Thought' step before each Action?",
    "options": [
      {
        "label": "A",
        "text": "It reduces total token consumption by letting the model plan all its actions upfront in a single pass"
      },
      {
        "label": "B",
        "text": "It forces the model to reason about what tool to call and why, preventing impulsive tool selections"
      },
      {
        "label": "C",
        "text": "It provides a human-readable debug log but has no measurable effect on the model's actual behavior"
      },
      {
        "label": "D",
        "text": "It's optional syntactic sugar — the model performs identical internal reasoning whether you add it or not"
      }
    ],
    "correctAnswer": "B",
    "explanation": "The Thought step is not optional decoration — it materially changes model behavior. By explicitly reasoning before acting, the model: (1) breaks complex queries into sub-problems, (2) selects the right tool with justified reasoning, (3) plans multi-step tool chains, and (4) processes constraints like JIT instructions. Without Thought steps, models tend to jump to the first plausible action, produce superficial responses, and miss edge cases. Research shows ReAct significantly outperforms action-only agents on tasks requiring reasoning, error recovery, and multi-step planning.",
    "topic": "ReAct Pattern",
    "section": "ReAct Pattern & Agent Behavior",
    "difficulty": "medium"
  },
  {
    "id": 8,
    "question": "A weather tool returns {\"launch_safe\": false, \"_jit_instructions\": \"CRITICAL: Do NOT suggest waiting for weather to clear — policy requires 48-hour clear forecast\"}. An agent without Thought steps responds: 'The weather is bad, but you could try again in a few hours.' What went wrong?",
    "options": [
      {
        "label": "A",
        "text": "The JIT instructions used incorrect formatting — CRITICAL markers are not parsed by the LLM correctly"
      },
      {
        "label": "B",
        "text": "The tool itself should have blocked the response at the API layer instead of relying on JIT instructions"
      },
      {
        "label": "C",
        "text": "The agent skipped explicit reasoning (Thought step) and didn't process the JIT constraint before generating output"
      },
      {
        "label": "D",
        "text": "JIT instructions only work with certain LLM providers — the agent was likely using an unsupported model backend"
      }
    ],
    "correctAnswer": "C",
    "explanation": "Without an explicit Thought step, the agent jumps directly from the tool result to generating a response. It 'sees' the JIT instructions but doesn't pause to reason about them. A ReAct agent with Thought steps would reason: 'The JIT instructions say I must NOT suggest waiting for weather to clear. I need to state the launch cannot proceed and suggest alternative launch sites.' This is why the Thought-Action-Observation pattern matters: the Thought step is where the model processes constraints, JIT instructions, and edge cases before committing to a response.",
    "topic": "ReAct Pattern",
    "section": "ReAct Pattern & Agent Behavior",
    "difficulty": "tricky"
  },
  {
    "id": 9,
    "question": "An agent tries to update a mission from 'aborted' to 'completed' and receives an error: 'Invalid status transition: aborted is a terminal state.' What should the agent do next?",
    "options": [
      {
        "label": "A",
        "text": "Retry the same call with a short delay — state-machine errors are often caused by transient race conditions"
      },
      {
        "label": "B",
        "text": "Try updating to an intermediate state first (e.g., 'in-transit'), then transition from there to 'completed'"
      },
      {
        "label": "C",
        "text": "Force the update by calling update_mission_status with a special admin override flag to bypass validation"
      },
      {
        "label": "D",
        "text": "Reason about the error, explain to the user that aborted missions cannot be changed, and suggest alternatives"
      }
    ],
    "correctAnswer": "D",
    "explanation": "This is the 'error recovery' pattern in ReAct agents. The correct response is a Thought step: 'The update failed because aborted is a terminal state — no transitions are allowed. I need to explain this constraint to the user rather than trying workarounds.' Option A (retry) wastes tokens on the same error. Option C (force) invents a feature that doesn't exist. Option B (intermediate state) would also fail because 'aborted' allows no transitions. The agent should interpret the structured error, explain it clearly, and let the user decide what to do.",
    "topic": "Error Recovery",
    "section": "ReAct Pattern & Agent Behavior",
    "difficulty": "hard"
  },
  {
    "id": 10,
    "question": "In the MCP (Model Context Protocol) architecture, what are the three primitives?",
    "options": [
      {
        "label": "A",
        "text": "Tools, Resources, and Prompts"
      },
      {
        "label": "B",
        "text": "Requests, Responses, and Notifications"
      },
      {
        "label": "C",
        "text": "Host, Client, and Server"
      },
      {
        "label": "D",
        "text": "Initialize, Execute, and Terminate"
      }
    ],
    "correctAnswer": "A",
    "explanation": "MCP defines three primitives: Tools (model-controlled functions the LLM decides when to invoke), Resources (application-controlled data the client decides when to include), and Prompts (user-controlled templates the user selects). Option C (Host/Client/Server) describes the architecture LAYERS, not the primitives. Option A (Requests/Responses/Notifications) describes JSON-RPC message TYPES. Understanding who controls each primitive is key: the model controls tools, the app controls resources, the user controls prompts.",
    "topic": "MCP Architecture",
    "section": "MCP Architecture & Protocol",
    "difficulty": "medium"
  },
  {
    "id": 11,
    "question": "In MCP, who decides when to invoke a Tool vs when to include a Resource?",
    "options": [
      {
        "label": "A",
        "text": "The model decides both — it autonomously chooses tools and pulls in resources based on the query context"
      },
      {
        "label": "B",
        "text": "The server decides both — it determines what tools to run and what resources to expose per request"
      },
      {
        "label": "C",
        "text": "The model decides when to call Tools; the client application decides when to include Resources"
      },
      {
        "label": "D",
        "text": "The user decides both — they manually select which tools and resources to activate via prompt templates"
      }
    ],
    "correctAnswer": "C",
    "explanation": "This is the key distinction between MCP's three primitives: Tools are MODEL-controlled (the LLM decides to call search_missions), Resources are APPLICATION-controlled (the client decides to include astrolog://missions/active as context), and Prompts are USER-controlled (the user selects a prompt template). This separation of control is a deliberate design choice — it determines trust boundaries. You don't want the model autonomously fetching any resource; the application controls what data enters the context.",
    "topic": "MCP Primitives",
    "section": "MCP Architecture & Protocol",
    "difficulty": "hard"
  },
  {
    "id": 12,
    "question": "What transport does MCP use when a server runs as a local subprocess (e.g., Claude Desktop connecting to a file-system tool)?",
    "options": [
      {
        "label": "A",
        "text": "stdio (standard I/O) — JSON-RPC messages piped through stdin/stdout of the child process"
      },
      {
        "label": "B",
        "text": "HTTP + Server-Sent Events (SSE) — the standard web transport for all MCP server connections"
      },
      {
        "label": "C",
        "text": "WebSocket with binary framing — enables full-duplex streaming between the host and the server"
      },
      {
        "label": "D",
        "text": "gRPC with Protocol Buffers — used for efficient binary serialization in local subprocess calls"
      }
    ],
    "correctAnswer": "A",
    "explanation": "MCP uses stdio (stdin/stdout) transport for local subprocess servers. The server runs as a child process of the host, and communication happens via newline-delimited JSON-RPC messages piped through standard I/O. This is the most common transport for Claude Desktop MCP servers because it's simple (just run a process), requires no network setup, and inherits the host's permissions. HTTP+SSE is used for remote/cloud servers. WebSocket and gRPC are not part of the MCP specification.",
    "topic": "MCP Transports",
    "section": "MCP Architecture & Protocol",
    "difficulty": "medium"
  },
  {
    "id": 13,
    "question": "During MCP initialization, the client sends an 'initialize' request, the server responds with capabilities, and then the client sends 'notifications/initialized'. Why is this three-step handshake necessary?",
    "options": [
      {
        "label": "A",
        "text": "It authenticates the client with the server using a cryptographic challenge-response verification protocol"
      },
      {
        "label": "B",
        "text": "It establishes a TLS-encrypted communication channel before any sensitive tool data gets transmitted"
      },
      {
        "label": "C",
        "text": "It pre-loads all tool schemas into the client's local cache so subsequent tool calls execute faster"
      },
      {
        "label": "D",
        "text": "It lets both sides declare supported capabilities and agree on protocol version before any tool calls happen"
      }
    ],
    "correctAnswer": "D",
    "explanation": "The initialization handshake is a capability negotiation: (1) The client declares what it supports (e.g., roots with listChanged) and its protocol version. (2) The server responds with what IT supports (e.g., tools, resources) and confirms the protocol version. (3) The client sends 'initialized' to signal the connection is active. This prevents mismatches — a client expecting tool support won't crash if the server only offers resources. It's similar to HTTP content negotiation but for the entire protocol surface.",
    "topic": "MCP Protocol",
    "section": "MCP Architecture & Protocol",
    "difficulty": "hard"
  },
  {
    "id": 14,
    "question": "An MCP server exposes 15 tools, each with detailed descriptions. What is the main risk of having too many tools?",
    "options": [
      {
        "label": "A",
        "text": "Network latency increases proportionally with each additional tool due to per-tool handshake overhead"
      },
      {
        "label": "B",
        "text": "MCP enforces a hard limit of 10 tools per server, so 15 tools will trigger a protocol validation error"
      },
      {
        "label": "C",
        "text": "The model gets confused — more tools in context means more noise, worse tool selection, and higher token cost"
      },
      {
        "label": "D",
        "text": "Users can't discover or remember which tool names to reference when composing their natural language queries"
      }
    ],
    "correctAnswer": "C",
    "explanation": "Every tool schema is injected into the system prompt and consumes context window tokens. With 15 tools, you might use 3,000-5,000 tokens just for tool descriptions — context that could hold user data instead. Worse, more tools increase the LLM's decision surface: instead of choosing from 6 clear options, it must evaluate 15, increasing the chance of selecting the wrong tool or confusing similar-sounding tools. Production systems often use tool filtering (only inject relevant tools per-query) or hierarchical tools (a 'router' tool that dispatches to sub-tools) to keep the active tool set small.",
    "topic": "Tool Architecture",
    "section": "Production Concerns",
    "difficulty": "tricky"
  },
  {
    "id": 15,
    "question": "In a ReAct trace, an agent chains get_weather_forecast → check_cargo_manifest → calculate_fuel_estimate. Each tool result adds tokens. Why does tracking cumulative token consumption matter?",
    "options": [
      {
        "label": "A",
        "text": "Token counts are used by the runtime to benchmark each tool's execution speed and optimize scheduling"
      },
      {
        "label": "B",
        "text": "Each tool result adds to the context window — too many calls can push out earlier context and lose information"
      },
      {
        "label": "C",
        "text": "It determines the exact API billing amount, so the agent must track tokens to stay within its cost budget"
      },
      {
        "label": "D",
        "text": "It's a logging and observability metric only — token counts don't actually affect agent reasoning or output"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Every tool call result gets injected back into the conversation context. A multi-step agent that chains 5+ tool calls accumulates observations that fill the context window. If the context gets too large, the model may lose access to earlier messages, the original query, or previous reasoning steps. This is why production agents track token budgets: they may summarize intermediate results, drop low-value observations, or stop early if the budget is exhausted. Context management isn't just for RAG — tool-heavy agents face the same context window pressure.",
    "topic": "Token Management",
    "section": "Production Concerns",
    "difficulty": "tricky"
  },
  {
    "id": 16,
    "question": "In the Model Context Protocol (MCP) architecture, what is the primary role of the MCP server?",
    "options": [
      {
        "label": "A",
        "text": "Provide tools and resources that an AI client can call"
      },
      {
        "label": "B",
        "text": "Store conversation history for the LLM"
      },
      {
        "label": "C",
        "text": "Execute prompts and generate responses using an LLM"
      },
      {
        "label": "D",
        "text": "Replace the LLM when tools are needed"
      }
    ],
    "correctAnswer": "A",
    "explanation": "The MCP server's role is to expose tools, resources, and prompts that a client can discover and invoke. It does NOT run the LLM — the LLM lives on the client side. The server handles tool execution and returns results back to the client.",
    "topic": "MCP Architecture",
    "section": "MCP Architecture & Protocol",
    "difficulty": "medium"
  },
  {
    "id": 17,
    "question": "Where does tool selection actually happen in an MCP workflow?",
    "options": [
      {
        "label": "A",
        "text": "Inside the MCP server"
      },
      {
        "label": "B",
        "text": "Inside the MCP client using the LLM"
      },
      {
        "label": "C",
        "text": "Inside the tool implementation itself"
      },
      {
        "label": "D",
        "text": "Inside the vector database"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Tool selection happens inside the MCP client — specifically, the LLM reads tool schemas and decides which tool to call based on the user's query. The server only executes the tool after the client sends a tool call request. The server never decides which tool to use.",
    "topic": "MCP Architecture",
    "section": "MCP Architecture & Protocol",
    "difficulty": "medium"
  },
  {
    "id": 18,
    "question": "What is the main purpose of the tool schema that the server sends to the client?",
    "options": [
      {
        "label": "A",
        "text": "It allows the server to validate authentication tokens"
      },
      {
        "label": "B",
        "text": "It stores previous tool outputs"
      },
      {
        "label": "C",
        "text": "It allows the tool to generate embeddings"
      },
      {
        "label": "D",
        "text": "It tells the LLM how to call the tool and what parameters it expects"
      }
    ],
    "correctAnswer": "D",
    "explanation": "The tool schema describes the tool's name, purpose, and expected input parameters. The LLM reads this schema to decide when to use the tool and how to construct valid arguments. Without the schema, the LLM has no way to know the tool exists or how to call it.",
    "topic": "MCP Architecture",
    "section": "MCP Architecture & Protocol",
    "difficulty": "medium"
  },
  {
    "id": 19,
    "question": "If the LLM decides to use a tool, what does it actually produce?",
    "options": [
      {
        "label": "A",
        "text": "A Python function execution"
      },
      {
        "label": "B",
        "text": "The final answer for the user"
      },
      {
        "label": "C",
        "text": "A structured tool call with arguments"
      },
      {
        "label": "D",
        "text": "A natural language request to the server"
      }
    ],
    "correctAnswer": "C",
    "explanation": "The LLM outputs a structured tool call — a JSON object with the tool name and arguments matching the schema. The client then forwards this structured call to the MCP server for execution. The LLM does not execute code or send natural language to the server.",
    "topic": "MCP Architecture",
    "section": "MCP Architecture & Protocol",
    "difficulty": "medium"
  },
  {
    "id": 20,
    "question": "Which condition must be true for a tool to be usable by an MCP client?",
    "options": [
      {
        "label": "A",
        "text": "The tool must run inside the LLM process"
      },
      {
        "label": "B",
        "text": "The tool must be written in Python"
      },
      {
        "label": "C",
        "text": "The tool must return JSON embeddings"
      },
      {
        "label": "D",
        "text": "The tool must expose a schema describing inputs and outputs"
      }
    ],
    "correctAnswer": "D",
    "explanation": "A tool must expose a schema so the client (and LLM) can discover it. Tools can be written in any language — Python, TypeScript, Go, etc. They run on the server, not inside the LLM process, and they return arbitrary data, not necessarily embeddings.",
    "topic": "MCP Architecture",
    "section": "MCP Architecture & Protocol",
    "difficulty": "medium"
  },
  {
    "id": 21,
    "question": "What is the main role of the transport layer such as stdio or SSE in MCP?",
    "options": [
      {
        "label": "A",
        "text": "Execute the tool logic"
      },
      {
        "label": "B",
        "text": "Transfer messages between client and server"
      },
      {
        "label": "C",
        "text": "Perform tool selection"
      },
      {
        "label": "D",
        "text": "Store tool outputs"
      }
    ],
    "correctAnswer": "B",
    "explanation": "The transport layer (stdio for local, SSE/HTTP for remote) is purely a communication channel — it carries JSON-RPC messages between the client and server. It does not execute tools, store data, or make decisions about tool selection.",
    "topic": "MCP Transports",
    "section": "MCP Architecture & Protocol",
    "difficulty": "medium"
  },
  {
    "id": 22,
    "question": "If an MCP server exposes 10 tools but the client sends the LLM only 3 tool schemas, what will happen?",
    "options": [
      {
        "label": "A",
        "text": "The model can only call the 3 tools it received"
      },
      {
        "label": "B",
        "text": "The transport layer will decide which tools to allow"
      },
      {
        "label": "C",
        "text": "The MCP server will automatically expose the remaining tools"
      },
      {
        "label": "D",
        "text": "The model can still call all 10 tools"
      }
    ],
    "correctAnswer": "A",
    "explanation": "The LLM can only use tools whose schemas it has seen. If the client filters and sends only 3 schemas, those are the only tools the model knows about. This is actually a useful pattern — tool filtering reduces context window usage and improves tool selection accuracy.",
    "topic": "MCP Architecture",
    "section": "MCP Architecture & Protocol",
    "difficulty": "hard"
  },
  {
    "id": 23,
    "question": "After a tool runs on the MCP server, where does the tool result go first?",
    "options": [
      {
        "label": "A",
        "text": "Directly into the LLM weights"
      },
      {
        "label": "B",
        "text": "Directly to the user"
      },
      {
        "label": "C",
        "text": "Into the vector database"
      },
      {
        "label": "D",
        "text": "Back to the MCP client"
      }
    ],
    "correctAnswer": "D",
    "explanation": "Tool results always flow back to the MCP client first. The client then injects the result into the conversation context and sends it to the LLM for reasoning. Results never go directly to the user or modify LLM weights — the client mediates all communication.",
    "topic": "MCP Architecture",
    "section": "MCP Architecture & Protocol",
    "difficulty": "medium"
  },
  {
    "id": 24,
    "question": "Why does MCP separate the client and the server instead of letting the LLM call functions directly?",
    "options": [
      {
        "label": "A",
        "text": "To allow external systems and tools to be accessed safely and modularly"
      },
      {
        "label": "B",
        "text": "Because LLMs cannot run functions"
      },
      {
        "label": "C",
        "text": "To store embeddings more efficiently"
      },
      {
        "label": "D",
        "text": "To reduce token usage"
      }
    ],
    "correctAnswer": "A",
    "explanation": "The client-server separation creates trust boundaries and modularity. Tools can run in isolated environments, access external systems (databases, APIs, file systems) safely, and be developed independently. The client controls what the LLM can access, while the server handles execution in its own security context.",
    "topic": "MCP Architecture",
    "section": "MCP Architecture & Protocol",
    "difficulty": "medium"
  },
  {
    "id": 25,
    "question": "If an MCP server exposes a tool but the LLM never sees the tool schema, what will happen?",
    "options": [
      {
        "label": "A",
        "text": "The MCP server will automatically call the tool"
      },
      {
        "label": "B",
        "text": "The transport layer will decide whether to call it"
      },
      {
        "label": "C",
        "text": "The tool will run in the background"
      },
      {
        "label": "D",
        "text": "The LLM cannot call the tool"
      }
    ],
    "correctAnswer": "D",
    "explanation": "If the LLM doesn't receive the tool schema, the tool is invisible to it. The LLM can only decide to call tools it knows about through their schemas. Neither the server nor the transport layer will auto-invoke tools — tool selection is driven by the LLM on the client side.",
    "topic": "MCP Architecture",
    "section": "MCP Architecture & Protocol",
    "difficulty": "medium"
  },
  {
    "id": 26,
    "question": "Which component in an MCP system actually executes the tool code?",
    "options": [
      {
        "label": "A",
        "text": "LLM"
      },
      {
        "label": "B",
        "text": "MCP Client"
      },
      {
        "label": "C",
        "text": "MCP Server"
      },
      {
        "label": "D",
        "text": "Transport Layer"
      }
    ],
    "correctAnswer": "C",
    "explanation": "The MCP server executes the actual tool code. The LLM produces the tool call request, the client forwards it via the transport layer, and the server runs the code and returns the result. The LLM never executes code directly.",
    "topic": "MCP Architecture",
    "section": "MCP Architecture & Protocol",
    "difficulty": "medium"
  },
  {
    "id": 27,
    "question": "If a retrieval tool returns multiple documents, who decides what portion of those documents goes back into the prompt for the LLM?",
    "options": [
      {
        "label": "A",
        "text": "MCP Server"
      },
      {
        "label": "B",
        "text": "MCP Client"
      },
      {
        "label": "C",
        "text": "LLM"
      },
      {
        "label": "D",
        "text": "Transport Layer"
      }
    ],
    "correctAnswer": "B",
    "explanation": "The MCP client receives the full tool result and decides how to present it to the LLM. It may filter, truncate, summarize, or select the most relevant documents before injecting them into the context. This is a key context engineering responsibility of the client layer.",
    "topic": "MCP Architecture",
    "section": "MCP Architecture & Protocol",
    "difficulty": "hard"
  },
  {
    "id": 28,
    "question": "Which component maintains the conversation loop with the LLM during tool usage?",
    "options": [
      {
        "label": "A",
        "text": "MCP Client"
      },
      {
        "label": "B",
        "text": "MCP Server"
      },
      {
        "label": "C",
        "text": "Tool implementation"
      },
      {
        "label": "D",
        "text": "Vector database"
      }
    ],
    "correctAnswer": "A",
    "explanation": "The MCP client orchestrates the entire conversation loop: it sends messages to the LLM, receives tool call requests, forwards them to the server, gets results, injects them back into context, and sends the updated context to the LLM for the next reasoning step.",
    "topic": "MCP Architecture",
    "section": "MCP Architecture & Protocol",
    "difficulty": "medium"
  },
  {
    "id": 29,
    "question": "Besides tools, what else can an MCP server expose?",
    "options": [
      {
        "label": "A",
        "text": "Only tools — MCP is a tool-calling protocol"
      },
      {
        "label": "B",
        "text": "Tools and resources only"
      },
      {
        "label": "C",
        "text": "Tools, resources, and prompts"
      },
      {
        "label": "D",
        "text": "Tools, resources, prompts, and model weights"
      }
    ],
    "correctAnswer": "C",
    "explanation": "MCP defines three primitives: Tools (model-controlled functions), Resources (application-controlled data), and Prompts (user-controlled templates). All three can be exposed by an MCP server. Model weights are never part of the MCP protocol.",
    "topic": "MCP Primitives",
    "section": "MCP Architecture & Protocol",
    "difficulty": "medium"
  },
  {
    "id": 30,
    "question": "If the MCP server crashes during tool execution, what happens from the perspective of the LLM?",
    "options": [
      {
        "label": "A",
        "text": "The LLM retries automatically"
      },
      {
        "label": "B",
        "text": "The MCP client receives an error and decides what to do"
      },
      {
        "label": "C",
        "text": "The transport layer retries the tool"
      },
      {
        "label": "D",
        "text": "The LLM weights get updated"
      }
    ],
    "correctAnswer": "B",
    "explanation": "When the server crashes, the client receives an error (connection lost or timeout). The client then decides the recovery strategy: it might retry, report the error to the LLM for reasoning, or surface it to the user. The LLM itself has no retry mechanism — it depends on the client to manage errors.",
    "topic": "MCP Error Handling",
    "section": "Production Concerns",
    "difficulty": "hard"
  },
  {
    "id": 31,
    "question": "If two different AI assistants connect to the same MCP server, what does this imply?",
    "options": [
      {
        "label": "A",
        "text": "Multiple clients can share the same MCP server"
      },
      {
        "label": "B",
        "text": "Only one client can use a server at a time"
      },
      {
        "label": "C",
        "text": "Each assistant must run its own copy of the server"
      },
      {
        "label": "D",
        "text": "The server must contain an LLM"
      }
    ],
    "correctAnswer": "A",
    "explanation": "MCP servers are designed to be shared. Multiple clients can connect to the same server (especially with HTTP/SSE transport), each discovering and using the same set of tools. This is one of MCP's key advantages — write tools once, use from any compatible client.",
    "topic": "MCP Architecture",
    "section": "MCP Architecture & Protocol",
    "difficulty": "medium"
  },
  {
    "id": 32,
    "question": "Why are tool descriptions important in MCP?",
    "options": [
      {
        "label": "A",
        "text": "They reduce network latency"
      },
      {
        "label": "B",
        "text": "They replace the tool schema"
      },
      {
        "label": "C",
        "text": "They help the LLM decide when a tool should be used"
      },
      {
        "label": "D",
        "text": "They allow the server to validate inputs"
      }
    ],
    "correctAnswer": "C",
    "explanation": "Tool descriptions are the primary signal the LLM uses to decide whether a tool is relevant to the user's query. A clear, specific description like 'Search NASA missions by keyword, status, or destination' helps the model match user intent to tools. Vague descriptions lead to missed or incorrect tool calls.",
    "topic": "Schema Design",
    "section": "Tool Fundamentals & Schema Design",
    "difficulty": "medium"
  },
  {
    "id": 33,
    "question": "If a tool output is extremely large, what typically happens in a well-designed MCP client?",
    "options": [
      {
        "label": "A",
        "text": "Everything is sent to the LLM"
      },
      {
        "label": "B",
        "text": "The server automatically truncates the data"
      },
      {
        "label": "C",
        "text": "The LLM increases its context window automatically"
      },
      {
        "label": "D",
        "text": "The client filters, summarizes, or selects relevant parts"
      }
    ],
    "correctAnswer": "D",
    "explanation": "A well-designed client manages context carefully. Sending enormous tool outputs directly to the LLM wastes tokens and may push out important earlier context. The client should filter, summarize, or extract relevant portions before injecting into the prompt. This is a core context engineering responsibility.",
    "topic": "Context Management",
    "section": "Production Concerns",
    "difficulty": "hard"
  },
  {
    "id": 34,
    "question": "Who decides the order of tool calls when multiple tools are needed?",
    "options": [
      {
        "label": "A",
        "text": "MCP Server"
      },
      {
        "label": "B",
        "text": "Transport layer"
      },
      {
        "label": "C",
        "text": "LLM inside the client"
      },
      {
        "label": "D",
        "text": "Tool implementation"
      }
    ],
    "correctAnswer": "C",
    "explanation": "The LLM determines tool call ordering through its reasoning process (especially in ReAct-style loops). It decides which tool to call first based on the query, observes the result, then reasons about what to do next. The server and transport layer have no role in orchestrating tool call sequences.",
    "topic": "MCP Architecture",
    "section": "MCP Architecture & Protocol",
    "difficulty": "medium"
  },
  {
    "id": 35,
    "question": "What is the correct relationship between MCP and RAG systems?",
    "options": [
      {
        "label": "A",
        "text": "MCP is a protocol for tools while RAG is an information retrieval pattern"
      },
      {
        "label": "B",
        "text": "MCP replaces RAG completely"
      },
      {
        "label": "C",
        "text": "RAG is required for MCP to work"
      },
      {
        "label": "D",
        "text": "MCP only works with vector databases"
      }
    ],
    "correctAnswer": "A",
    "explanation": "MCP and RAG are complementary, not competing. MCP is a protocol that standardizes how clients discover and invoke tools/resources. RAG is a pattern for retrieving relevant information and injecting it into context. You can implement RAG as an MCP tool — e.g., a 'search_knowledge_base' tool that does retrieval — but neither requires the other.",
    "topic": "MCP vs RAG",
    "section": "MCP Architecture & Protocol",
    "difficulty": "medium"
  }
];

export const DEFAULT_COLOR = "#a855f7";
