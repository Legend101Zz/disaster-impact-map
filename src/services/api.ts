import axios from "axios";
import { EarthquakeData, WeatherAlert } from "@/types/disasters";

const USGS_API = import.meta.env.VITE_USGS_EARTHQUAKE_API;
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export class DisasterAPI {
  static async getEarthquakes(
    timeRange: string = "day"
  ): Promise<EarthquakeData[]> {
    try {
      const response = await axios.get(`${USGS_API}/${timeRange}.geojson`);
      return response.data.features;
    } catch (error) {
      console.error("Error fetching earthquake data:", error);
      return [];
    }
  }

  static async getWeatherAlerts(
    lat: number,
    lon: number
  ): Promise<WeatherAlert[]> {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/alerts.json?key=${WEATHER_API_KEY}&q=${lat},${lon}`
      );
      return response.data.alerts;
    } catch (error) {
      console.error("Error fetching weather alerts:", error);
      return [];
    }
  }
}
