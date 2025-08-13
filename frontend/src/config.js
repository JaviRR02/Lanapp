import { Platform } from "react-native";
import * as Network from "expo-network";

const getBaseUrl = async () => {
  try {
    if (Platform.OS === "android" && !process.env.EXPO_PUBLIC_IS_DEVICE) {
      return "http://10.0.2.2:8000";
    }
    const networkInfo = await Network.getNetworkStateAsync();
    if (networkInfo.isConnected) {
      const ipAddress = await Network.getIpAddressAsync();
      if (ipAddress) {
        console.log("IP detectada:", ipAddress); // Log para depuración
        return `http://${ipAddress}:8000`;
      }
    }
    console.warn("No se pudo detectar la IP, usando fallback");
    return "http://172.20.10.7:8000";
  } catch (error) {
    console.error("Error obteniendo IP:", error);
    return "http://172.20.10.7:8000";
  }
};

export const BASE_URL = getBaseUrl();