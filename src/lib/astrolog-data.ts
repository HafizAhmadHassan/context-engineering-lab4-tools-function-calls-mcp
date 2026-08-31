export interface Mission {
  id: string;
  name: string;
  destination: string;
  status: "planned" | "in-transit" | "completed" | "aborted" | "delayed";
  launchDate: string;
  crew: string[];
  fuelAvailable: number;
  payloadWeight: number;
  launchSafe: boolean;
}

export interface Crew {
  id: string;
  name: string;
  role: string;
  schedule: string;
}

export interface Weather {
  location: string;
  condition: string;
  temperature: number;
  windSpeed: number;
  launchSafe: boolean;
}

export const missions: Mission[] = [
  {
    id: "M-001",
    name: "Lunar Gateway",
    destination: "Moon",
    status: "completed",
    launchDate: "2026-01-12",
    crew: ["c-001", "c-002"],
    fuelAvailable: 1200,
    payloadWeight: 2200,
    launchSafe: true,
  },
  {
    id: "M-002",
    name: "Mars Pathfinder Relay",
    destination: "Mars",
    status: "in-transit",
    launchDate: "2026-05-03",
    crew: ["c-003"],
    fuelAvailable: 3400,
    payloadWeight: 1500,
    launchSafe: true,
  },
  {
    id: "M-003",
    name: "Titan Surveyor",
    destination: "Titan",
    status: "planned",
    launchDate: "2026-11-20",
    crew: ["c-004", "c-005"],
    fuelAvailable: 4800,
    payloadWeight: 3100,
    launchSafe: true,
  },
  {
    id: "M-004",
    name: "Venus Atmosphere Probe",
    destination: "Venus",
    status: "delayed",
    launchDate: "2027-02-08",
    crew: ["c-001"],
    fuelAvailable: 2600,
    payloadWeight: 980,
    launchSafe: false,
  },
  {
    id: "M-005",
    name: "Ceres Asteroid Mining",
    destination: "Ceres",
    status: "planned",
    launchDate: "2027-06-15",
    crew: ["c-005", "c-006"],
    fuelAvailable: 5200,
    payloadWeight: 4100,
    launchSafe: true,
  },
  {
    id: "M-006",
    name: "Europa Ice Survey",
    destination: "Europa",
    status: "in-transit",
    launchDate: "2026-08-01",
    crew: ["c-002", "c-004"],
    fuelAvailable: 3800,
    payloadWeight: 2400,
    launchSafe: true,
  },
];

export const crewMembers: Crew[] = [
  { id: "c-001", name: "Dr. Aiko Tanaka", role: "Commander", schedule: "Day shift / On-duty" },
  { id: "c-002", name: "Engineer Marcus Wright", role: "Systems Engineer", schedule: "Night shift / Resting" },
  { id: "c-003", name: "Lt. Priya Sharma", role: "Pilot", schedule: "Day shift / On-duty" },
  { id: "c-004", name: "Captain Elena Rossi", role: "Mission Specialist", schedule: "Day shift / Training" },
  { id: "c-005", name: "Dr. Omar Farouk", role: "Science Officer", schedule: "Night shift / On-duty" },
  { id: "c-006", name: "Tech Sam Whitfield", role: "Crew Engineer", schedule: "Rotational / Off-duty" },
];

export const weatherData: Weather[] = [
  {
    location: "Cape Canaveral",
    condition: "Partly cloudy",
    temperature: 24,
    windSpeed: 12,
    launchSafe: true,
  },
  {
    location: "Boca Chica",
    condition: "Thunderstorms",
    temperature: 29,
    windSpeed: 31,
    launchSafe: false,
  },
  {
    location: "Vandenberg",
    condition: "Clear",
    temperature: 18,
    windSpeed: 8,
    launchSafe: true,
  },
];
