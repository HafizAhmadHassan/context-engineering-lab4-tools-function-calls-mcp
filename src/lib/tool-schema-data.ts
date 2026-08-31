export interface ToolSchema {
  toolLabel: string;
  vague: {
    name: string;
    description: string;
    schema: string;
  };
  wellDesigned: {
    name: string;
    description: string;
    schema: string;
  };
}

export const toolSchemas: Record<string, ToolSchema> = {
  "Mission Search": {
    toolLabel: "missions",
    vague: {
      name: "missions",
      description: "Gets missions.",
      schema: `{
  "name": "missions",
  "description": "Gets missions.",
  "parameters": {
    "type": "object",
    "properties": {
      "q": {
        "type": "string",
        "description": "query"
      }
    },
    "required": [
      "q"
    ]
  }
}`,
    },
    wellDesigned: {
      name: "search_missions",
      description:
        "Search the AstroLog mission database by keyword, status, or destination. Returns matching missions with their ID, name, destination, status, launch date, and assigned crew. Use when the user asks about missions, launches, schedules, or destinations.",
      schema: `{
  "name": "search_missions",
  "description": "Search the AstroLog mission database by keyword, status, or destination. Returns matching missions with their ID, name, destination, status, launch date, and assigned crew. Use when the user asks about missions, launches, schedules, or destinations.",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Search keyword to match against mission name, destination, or crew names"
      },
      "status": {
        "type": "string",
        "description": "Filter by mission status",
        "enum": [ "planned", "in-transit", "completed", "delayed", "aborted" ]
      },
      "destination": {
        "type": "string",
        "description": "Filter by destination (e.g., 'Mars Orbit', 'Europa', 'ISS')"
      }
    },
    "required": [ "query" ]
  }
}`,
    },
  },
  "Crew Schedule": {
    toolLabel: "crew",
    vague: {
      name: "crew",
      description: "Gets crew info.",
      schema: `{
  "name": "crew",
  "description": "Gets crew info.",
  "parameters": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "description": "crew id"
      },
      "d": {
        "type": "string",
        "description": "date"
      }
    },
    "required": [ "id", "d" ]
  }
}`,
    },
    wellDesigned: {
      name: "get_crew_schedule",
      description:
        "Retrieve the schedule for a specific crew member on a given date. Returns their name, role, current mission assignment, and list of scheduled activities. Use when the user asks about crew availability, schedules, or assignments.",
      schema: `{
  "name": "get_crew_schedule",
  "description": "Retrieve the schedule for a specific crew member on a given date. Returns their name, role, current mission assignment, and list of scheduled activities. Use when the user asks about crew availability, schedules, or assignments.",
  "parameters": {
    "type": "object",
    "properties": {
      "crew_id": {
        "type": "string",
        "description": "Crew member ID (format: C-XXX, e.g., 'C-001')"
      },
      "date": {
        "type": "string",
        "description": "Date to check schedule for (format: YYYY-MM-DD)"
      }
    },
    "required": [ "crew_id", "date" ]
  }
}`,
    },
  },
  "Cargo Manifest": {
    toolLabel: "cargo",
    vague: {
      name: "cargo",
      description: "Check cargo.",
      schema: `{
  "name": "cargo",
  "description": "Check cargo.",
  "parameters": {
    "type": "object",
    "properties": {
      "mission": {
        "type": "string",
        "description": "mission"
      }
    },
    "required": [ "mission" ]
  }
}`,
    },
    wellDesigned: {
      name: "check_cargo_manifest",
      description:
        "Retrieve the full cargo manifest for a specific mission. Returns a list of cargo items with their ID, name, weight (kg), category, and delivery status. Use when the user asks about cargo, payload, weight, or supplies for a mission.",
      schema: `{
  "name": "check_cargo_manifest",
  "description": "Retrieve the full cargo manifest for a specific mission. Returns a list of cargo items with their ID, name, weight (kg), category, and delivery status. Use when the user asks about cargo, payload, weight, or supplies for a mission.",
  "parameters": {
    "type": "object",
    "properties": {
      "mission_id": {
        "type": "string",
        "description": "Mission ID (format: M-XXX, e.g., 'M-002')"
      }
    },
    "required": [ "mission_id" ]
  }
}`,
    },
  },
  "Fuel Estimate": {
    toolLabel: "fuel",
    vague: {
      name: "fuel",
      description: "Calculates fuel.",
      schema: `{
  "name": "fuel",
  "description": "Calculates fuel.",
  "parameters": {
    "type": "object",
    "properties": {
      "w": {
        "type": "number",
        "description": "weight"
      },
      "dest": {
        "type": "string",
        "description": "where to go"
      }
    },
    "required": [ "w", "dest" ]
  }
}`,
    },
    wellDesigned: {
      name: "calculate_fuel_estimate",
      description:
        "Calculate estimated fuel requirements for a mission based on payload weight and destination. Returns fuel estimate in kg, cost estimate in USD, and safety margin. Use when the user asks about fuel needs, mission costs, or payload capacity planning.",
      schema: `{
  "name": "calculate_fuel_estimate",
  "description": "Calculate estimated fuel requirements for a mission based on payload weight and destination. Returns fuel estimate in kg, cost estimate in USD, and safety margin. Use when the user asks about fuel needs, mission costs, or payload capacity planning.",
  "parameters": {
    "type": "object",
    "properties": {
      "payload_weight": {
        "type": "number",
        "description": "Total payload weight in kilograms (must be positive)"
      },
      "destination": {
        "type": "string",
        "description": "Target destination for fuel calculation",
        "enum": [ "ISS", "Moon", "Lunar Gateway", "Mars Orbit", "Venus", "Europa", "Titan", "Ceres" ]
      }
    },
    "required": [ "payload_weight", "destination" ]
  }
}`,
    },
  },
};

export const schemaChecklist = [
  "Verb-Noun Naming",
  "Clear Descriptions",
  "Enum Constraints",
  "Required vs Optional",
  "Return Descriptions",
  "Low Parameter Count",
];
