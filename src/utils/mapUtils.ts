import * as Cesium from "cesium";
import { DisasterZone, RiskLevel } from "@/types/disasters";

export const getRiskColor = (riskLevel: RiskLevel): Cesium.Color => {
  switch (riskLevel) {
    case "severe":
      return Cesium.Color.RED.withAlpha(0.7);
    case "high":
      return Cesium.Color.ORANGE.withAlpha(0.7);
    case "medium":
      return Cesium.Color.YELLOW.withAlpha(0.7);
    case "low":
      return Cesium.Color.GREEN.withAlpha(0.7);
    default:
      return Cesium.Color.BLUE.withAlpha(0.7);
  }
};

export const calculateImpactRadius = (magnitude: number): number => {
  // WIll update it ... hardcoded for now :)
  return Math.pow(2, magnitude) * 1000; // meters
};

export const createCirclePolygon = (
  center: number[],
  radiusMeters: number,
  segments: number = 64
): number[] => {
  const coords: number[] = [];
  const centerCartographic = Cesium.Cartographic.fromDegrees(
    center[0],
    center[1]
  );

  for (let i = 0; i <= segments; i++) {
    const bearing = (i * 360) / segments;
    const point = new Cesium.Cartographic();

    // Calculate point on circle
    Cesium.Cartographic.destinationCartographic(
      centerCartographic,
      (bearing * Math.PI) / 180,
      radiusMeters,
      point
    );

    coords.push(
      Cesium.Math.toDegrees(point.longitude),
      Cesium.Math.toDegrees(point.latitude)
    );
  }

  return coords;
};

// src/utils/dataUtils.ts
export const formatDate = (date: string | number): string => {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const calculateSeverity = (magnitude: number): string => {
  if (magnitude >= 7) return "Extreme";
  if (magnitude >= 6) return "Severe";
  if (magnitude >= 5) return "Moderate";
  return "Minor";
};
