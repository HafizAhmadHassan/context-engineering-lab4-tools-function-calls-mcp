export interface TraceStep {
  type: "thought" | "action" | "observation" | "answer";
  tokens: number;
  content: string;
}

export interface Scenario {
  id: string;
  label: string;
  description: string;
  query: string;
  maxTokens: number;
  steps: TraceStep[];
}

const searchMissions = `search_missions(query="in-transit", status="in-transit")`;
const obsBasic = `{"missions": [{"id": "M-002", "name": "Mars Pathfinder Relay", "destination": "Mars Orbit", "status": "in-transit", "launchDate": "2026-02-01", "crew": ["Lt. Priya Sharma", "Engineer Marcus Wright", "Dr. Aiko Tanaka"]}]}`;

export const scenarios: Scenario[] = [
  {
    id: "basic",
    label: "Basic Lookup",
    description:
      "A straightforward single-tool query requiring one search and response.",
    query: "“What missions are currently in transit?”",
    maxTokens: 205,
    steps: [
      {
        type: "thought",
        tokens: 35,
        content:
          "The user wants to know about missions that are currently in transit. I should search for missions with status 'in-transit'.",
      },
      { type: "action", tokens: 25, content: searchMissions },
      { type: "observation", tokens: 65, content: obsBasic },
      {
        type: "thought",
        tokens: 30,
        content:
          "I found one mission in transit: Mars Pathfinder Relay (M-002). I have all the details needed to answer the user.",
      },
      {
        type: "answer",
        tokens: 25,
        content:
          "There is currently 1 mission in transit: Mars Pathfinder Relay (M-002), bound for Mars Orbit. It launched on 2026-02-01 with a crew of three astronauts.",
      },
    ],
  },
  {
    id: "multi-step",
    label: "Multi-Step Planning",
    description:
      "Requires chaining multiple tool calls to answer a complex question about mission logistics.",
    query:
      "“Can we launch the ISS Resupply Delta on March 10? Check the weather and cargo weight, then estimate fuel.”",
    maxTokens: 425,
    steps: [
      {
        type: "thought",
        tokens: 50,
        content:
          "The user wants to know if M-003 (ISS Resupply Delta) can launch on March 10. I need to: (1) check weather at the launch site, (2) get cargo manifest to calculate total weight, and (3) estimate fuel. Let me start with weather.",
      },
      {
        type: "action",
        tokens: 30,
        content: `get_weather_forecast(location="Cape Canaveral", date="2026-03-10")`,
      },
      {
        type: "observation",
        tokens: 55,
        content: `{"location": "Cape Canaveral", "date": "2026-03-10", "conditions": "Partly cloudy", "windSpeed": 18, "temperature": 24, "launchSafe": true, "notes": "Cumulus clearing by noon. Window 14:00-18:00 UTC is optimal."}`,
      },
      {
        type: "thought",
        tokens: 35,
        content:
          "Weather is good — launch is safe at Cape Canaveral on March 10. Now I need to check the cargo manifest for M-003 to get the total payload weight.",
      },
      {
        type: "action",
        tokens: 20,
        content: `check_cargo_manifest(mission_id="M-003")`,
      },
      {
        type: "observation",
        tokens: 50,
        content: `{"mission_id": "M-003", "items": [{"name": "Oxygen Generation Module", "weight": 410, "status": "loaded"}, {"name": "Crew Personal Effects", "weight": 25, "status": "loaded"}], "total_weight": 435}`,
      },
      {
        type: "thought",
        tokens: 25,
        content:
          "Cargo total is 435 kg. Now I can calculate fuel estimate for ISS destination with 435 kg payload.",
      },
      {
        type: "action",
        tokens: 25,
        content: `calculate_fuel_estimate(payload_weight=435, destination="ISS")`,
      },
      {
        type: "observation",
        tokens: 45,
        content: `{"fuel_kg": 2217.5, "cost_usd": 110875, "safety_margin": 1.15, "_jit_instructions": "When presenting fuel estimates: (1) 15% safety margin is included. (2) Present cost with $ formatting. (3) Suggest checking weather at launch site."}`,
      },
      {
        type: "thought",
        tokens: 40,
        content:
          "I now have all the information: weather is safe, cargo is 435 kg, fuel estimate is ~2,218 kg ($110,875). I can give a comprehensive answer.",
      },
      {
        type: "answer",
        tokens: 50,
        content:
          "Yes, ISS Resupply Delta (M-003) can launch on March 10. Weather at Cape Canaveral is safe (partly cloudy, 18 km/h winds). Cargo weighs 435 kg. Estimated fuel: 2,217.5 kg (~$110,875) within a 15% safety margin. All systems are go.",
      },
    ],
  },
  {
    id: "error-recovery",
    label: "Error Recovery",
    description:
      "The agent encounters an error from a tool call and must adapt its approach to still answer the user.",
    query: "“Update the Venus Atmosphere Probe mission to 'completed' status.”",
    maxTokens: 270,
    steps: [
      {
        type: "thought",
        tokens: 30,
        content:
          "The user wants to update the Venus Atmosphere Probe mission status to 'completed'. Let me first find the mission to get its ID.",
      },
      {
        type: "action",
        tokens: 20,
        content: `search_missions(query="Venus Atmosphere Probe")`,
      },
      {
        type: "observation",
        tokens: 45,
        content: `{"missions": [{"id": "M-008", "name": "Venus Atmosphere Probe", "destination": "Venus", "status": "aborted", "launchDate": "2026-01-28"}]}`,
      },
      {
        type: "thought",
        tokens: 25,
        content:
          "Found the mission: M-008, currently status 'aborted'. I'll try to update it to 'completed'.",
      },
      {
        type: "action",
        tokens: 25,
        content: `update_mission_status(mission_id="M-008", status="completed")`,
      },
      {
        type: "observation",
        tokens: 35,
        content: `{"error": "Cannot update mission M-008 from 'aborted' to 'completed'. Mission was aborted and cannot transition to completed.", "code": "INVALID_TRANSITION"}`,
      },
      {
        type: "thought",
        tokens: 35,
        content:
          "The update failed because the mission was aborted and can't transition directly to 'completed'. This is an invalid state transition. I should report the error clearly rather than retry with the same invalid status.",
      },
      {
        type: "answer",
        tokens: 25,
        content:
          "I can't update the Venus Atmosphere Probe (M-008) to 'completed'. It was previously aborted, which is a terminal state that cannot transition to 'completed'. You may need to archive the mission or create a replacement mission.",
      },
    ],
  },
];
