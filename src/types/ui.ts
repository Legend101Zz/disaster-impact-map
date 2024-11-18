import { DisasterType, RiskLevel } from "./disasters";

export interface FilterState {
  disasterType: DisasterType[];
  riskLevel: RiskLevel[];
  timeRange: "day" | "week" | "month" | "year";
}
