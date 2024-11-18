import axios from "axios";
import { DisasterZone } from "@/types/disasters";

const USGS_API_BASE = import.meta.env.VITE_USGS_EARTHQUAKE_API;

interface EarthquakeAPIParams {
  starttime?: string;
  endtime?: string;
  minmagnitude?: number;
  maxmagnitude?: number;
  latitude?: number;
  longitude?: number;
  maxradiuskm?: number;
  limit?: number;
}

export const fetchEarthquakes = async (
  params: EarthquakeAPIParams = {}
): Promise<DisasterZone[]> => {
  try {
    const response = await axios.get(`${USGS_API_BASE}/query`, {
      params: {
        format: "geojson",
        starttime:
          params.starttime ||
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endtime: params.endtime || new Date().toISOString(),
        minmagnitude: params.minmagnitude || 4.0,
        orderby: "magnitude",
        ...params,
      },
    });

    return response.data.features.map((feature: any) => ({
      id: feature.id,
      type: "earthquake",
      coordinates: feature.geometry.coordinates,
      riskLevel: calculateRiskLevel(feature.properties.mag),
      description: feature.properties.place,
      magnitude: feature.properties.mag,
      time: feature.properties.time,
      depth: feature.geometry.coordinates[2],
    }));
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    return [];
  }
};

const calculateRiskLevel = (
  magnitude: number
): "low" | "medium" | "high" | "severe" => {
  if (magnitude >= 7) return "severe";
  if (magnitude >= 5.5) return "high";
  if (magnitude >= 4) return "medium";
  return "low";
};
