import * as Cesium from "cesium";

const CESIUM_ION_TOKEN = import.meta.env.CESIUM_ION_TOKEN;

export const initializeCesium = () => {
  Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN;
};
