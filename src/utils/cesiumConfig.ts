import * as Cesium from "cesium";

const CESIUM_ION_TOKEN = import.meta.env.VITE_CESIUM_ION_TOKEN;
const VITE_GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


export const initializeCesium = () => {
  Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN;
  Cesium.GoogleMaps.defaultApiKey = VITE_GOOGLE_MAPS_API_KEY
  Cesium.RequestScheduler.requestsByServer["tile.googleapis.com:443"] = 18;

  return Cesium
};
