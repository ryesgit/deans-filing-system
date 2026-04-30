import { getRuntimeConfigValue } from "./runtimeConfig";

export const API_BASE_URL = getRuntimeConfigValue(
  "VITE_API_BASE_URL",
  "http://localhost:3001"
).replace(/\/+$/, "");
