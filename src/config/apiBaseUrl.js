const runtimeConfig = typeof window !== "undefined" ? window.__APP_CONFIG__ || {} : {};

export const API_BASE_URL = (
  runtimeConfig.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3001"
).replace(/\/+$/, "");
