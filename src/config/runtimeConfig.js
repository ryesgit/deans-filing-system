const runtimeConfig = typeof window !== "undefined" ? window.__APP_CONFIG__ || {} : {};

export const getRuntimeConfigValue = (key, fallback = "") =>
  runtimeConfig[key] || import.meta.env[key] || fallback;

