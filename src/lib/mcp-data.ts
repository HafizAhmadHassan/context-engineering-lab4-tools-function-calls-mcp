export const mcpTools = [
  { name: "search_missions", description: "Search mission database" },
  { name: "get_crew_schedule", description: "Get crew member schedule" },
  { name: "check_cargo_manifest", description: "Check mission cargo" },
  { name: "update_mission_status", description: "Update mission status" },
  { name: "get_weather_forecast", description: "Get launch site weather" },
  { name: "calculate_fuel_estimate", description: "Calculate fuel needs" },
];

export const mcpResources = [
  { uri: "astrolog://missions/active" },
  { uri: "astrolog://crew/schedule" },
  { uri: "astrolog://weather/latest" },
];

export const mcpPrompts = [
  { name: "mission-brief" },
  { name: "launch-checklist" },
  { name: "crew-report" },
];

export const serverConfig = `{
  "name": "astrolog-mcp-server",
  "version": "0.1.0",
  "capabilities": {
    "tools": { "listChanged": true },
    "resources": { "listChanged": true },
    "prompts": { "listChanged": true }
  },
  "tools": [
    "search_missions",
    "get_crew_schedule",
    "check_cargo_manifest",
    "get_weather_forecast"
  ],
  "resources": [ "astrolog://missions/active" ],
  "prompts": [ "mission-brief" ]
}`;

export const transportsData = [
  {
    name: "stdio (Standard I/O)",
    mode: "Subprocess + stdin/stdout",
    description:
      "Server runs as a subprocess. Communication happens over stdin/stdout using newline-delimited JSON.",
    pros: [
      "Simple to set up — just run a process",
      "No network configuration needed",
      "Inherits host process permissions",
      "Low latency (in-process pipe)",
    ],
    cons: [
      "Server must run on same machine",
      "Cannot be shared across hosts",
      "Lifecycle tied to host process",
    ],
    use: "Local tools like file access, git, or database CLIs. Most Claude Desktop MCP servers use stdio.",
  },
  {
    name: "HTTP + SSE (Streamable)",
    mode: "HTTP endpoint + Server-Sent Events",
    description:
      "Server runs as an HTTP endpoint. Uses Server-Sent Events for server-to-client streaming and HTTP POST for client-to-server messages.",
    pros: [
      "Server can run anywhere (local, cloud, edge)",
      "Supports multiple simultaneous clients",
      "Stateless — easily scalable",
      "Firewall/proxy friendly",
    ],
    cons: [
      "Requires network setup and auth",
      "Higher latency than stdio",
      "More complex error handling",
    ],
    use: "Remote services, shared team servers, cloud-hosted tools. Production MCP deployments typically use HTTP+SSE.",
  },
];
