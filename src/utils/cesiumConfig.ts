import * as Cesium from "cesium";

const CESIUM_ION_TOKEN = import.meta.env.VITE_CESIUM_ION_TOKEN;
const VITE_GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const initializeCesium = () => {
  console.log(" CESIUM_ION_TOKEN ", CESIUM_ION_TOKEN);

  Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN;
  Cesium.GoogleMaps.defaultApiKey = VITE_GOOGLE_MAPS_API_KEY;
  Cesium.RequestScheduler.requestsByServer["tile.googleapis.com:443"] = 18;

  return Cesium;
};

export const CESIUM_CONFIG = {
  terrainProvider: Cesium.createWorldTerrainAsync(),
  baseLayerPicker: false,
  timeline: false,
  animation: false,
  homeButton: false,
  scene3DOnly: true,
  navigationHelpButton: false,
};
