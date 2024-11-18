import { DisasterZone, RiskLevel, EarthquakeData } from "@/types/disasters";

export const calculateRiskLevel = (magnitude: number): RiskLevel => {
  if (magnitude >= 7) return "severe";
  if (magnitude >= 5) return "high";
  if (magnitude >= 3) return "medium";
  return "low";
};

export const convertEarthquakeToZone = (
  earthquake: EarthquakeData
): DisasterZone => {
  const { id, properties, geometry } = earthquake;
  return {
    id,
    type: "earthquake",
    riskLevel: calculateRiskLevel(properties.mag),
    coordinates: geometry.coordinates,
    description: properties.title,
    lastIncident: new Date(properties.time).toISOString(),
  };
};
