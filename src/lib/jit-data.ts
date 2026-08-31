export interface JitTool {
  name: string;
  description: string;
  standard: string;
  enhanced: string;
}

export const jitTools: JitTool[] = [
  {
    name: "calculate_fuel_estimate",
    description: "Compares the raw tool output with and without injected JIT instructions.",
    standard: `{
  "fuel_kg": 52500,
  "cost_usd": 2625000,
  "safety_margin": 1.15
}`,
    enhanced: `{
  "fuel_kg": 52500,
  "cost_usd": 2625000,
  "safety_margin": 1.15,
  "_jit_instructions": "IMPORTANT: When presenting fuel estimates, always: (1) Note that the 15% safety margin is already included. (2) If fuel_kg > 50000, warn that this requires a heavy-lift vehicle. (3) Present cost in millions (e.g., $2.6M not $2,625,000). (4) Suggest checking weather at the launch site before finalizing."
}`,
  },
  {
    name: "get_weather_forecast",
    description: "Shows how JIT instructions can enforce safety policies in the returned data.",
    standard: `{
  "location": "Cape Canaveral",
  "conditions": "Thunderstorms",
  "windSpeed": 45,
  "temperature": 29,
  "launchSafe": false
}`,
    enhanced: `{
  "location": "Cape Canaveral",
  "conditions": "Thunderstorms",
  "windSpeed": 45,
  "temperature": 29,
  "launchSafe": false,
  "_jit_instructions": "CRITICAL SAFETY: When launchSafe is false, never suggest rescheduling or 'waiting for the weather to clear.' Instead, (1) clearly state that launch is NOT safe, (2) list the unsafe conditions, and (3) recommend checking alternative launch sites or sending crew back to quarters."
}`,
  },
];
