export * from "./routes";
export * from "./api";
export const APP_VERSION = "1.0.0";
export const STORAGE_KEYS = {
  AUTH_TOKEN: "saas_auth_token",
  REFRESH_TOKEN: "saas_refresh_token",
  THEME: "saas_theme",
} as const;
