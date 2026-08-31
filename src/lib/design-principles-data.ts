export interface Principle {
  title: string;
  description: string;
  good: string;
  bad: string;
}

export const designPrinciples: Principle[] = [
  {
    title: "Verb-Noun Naming",
    description:
      "Tool names should use verb_noun format (e.g., search_missions, not missions or getMissions).",
    good: "search_missions",
    bad: "missions",
  },
  {
    title: "Clear Descriptions",
    description:
      "Descriptions should say what the tool does, what it returns, and when to use it.",
    good:
      "Search the AstroLog mission database by keyword. Returns matching missions with status, crew, and destination. Use when the user asks about missions, launches, or destinations.",
    bad: "Gets missions.",
  },
  {
    title: "Enum Constraints",
    description:
      "Use enums for parameters with a fixed set of valid values to prevent invalid inputs.",
    good: '"enum": ["planned", "in-transit", "completed", "delayed", "aborted"]',
    bad: '"type": "string" // any status value',
  },
  {
    title: "Required vs Optional",
    description:
      "Mark parameters as required only when the tool cannot function without them. Optional params enable flexible queries.",
    good: "query (required), status (optional), destination (optional)",
    bad: "query (required), status (required), destination (required)",
  },
  {
    title: "Return Descriptions",
    description:
      "Document what the tool returns so the LLM knows how to interpret and present results.",
    good:
      "Returns: { missions: Array<{ id, name, destination, status, launchDate, crew }> }",
    bad: "(no return description)",
  },
  {
    title: "Low Parameter Count",
    description:
      "Keep parameters under 5. Combine related fields into objects or use sensible defaults. More params = more chances for the LLM to make errors.",
    good: "3 params: query, status?, destination?",
    bad: "8 params: query, status, destination, crew, launchDate, sortBy, limit, offset",
  },
];
