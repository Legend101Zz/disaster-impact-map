//@ts-nocheck
import axios from "axios";
import { EarthquakeData, WeatherAlert } from "@/types/disasters";
import { fetchEarthquakes } from "./earthquakeService";

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export class DisasterAPI {
  static async getEarthquakes(): Promise<any> {
    try {
      const earthquakeData = await fetchEarthquakes({
        minmagnitude: 4.0,
        limit: 100,
      });
      console.log("earthquakeData", earthquakeData);
      return earthquakeData;
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
