import { DisasterZone, RiskLevel, EarthquakeData } from "@/types/disasters";

export const calculateRiskLevel = (magnitude: number): RiskLevel => {
  if (magnitude >= 7) return "severe";
  if (magnitude >= 5) return "high";
  if (magnitude >= 3) return "medium";
  return "low";
};

export const convertEarthquakeToZone = (earthquake: any): DisasterZone => {
  return {
    id: earthquake.id,
    type: earthquake.type!,
    riskLevel: earthquake.riskLevel,
    coordinates: earthquake.coordinates,
    description: earthquake.description,
    lastIncident: new Date(earthquake.time).toISOString(),
  };
};
