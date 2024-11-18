export type DisasterType = "earthquake" | "flood" | "fire";

export type RiskLevel = "low" | "medium" | "high" | "severe";

export interface DisasterZone {
  id: string;
  type: DisasterType;
  riskLevel: RiskLevel;
  coordinates: number[];
  population?: number;
  lastIncident?: string;
  description?: string;
}

export interface EarthquakeData {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  riskLevel: string;
  type: string;
  level: string | number;
  description: string;
  coordinates: [number, number, number];
}

export interface WeatherAlert {
  id: string;
  event: string;
  severity: string;
  area: string;
  headline: string;
  description: string;
  effective: string;
  expires: string;
}
