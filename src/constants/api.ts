export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_OTP: "/auth/verify-otp",
    RESET_PASSWORD: "/auth/reset-password",
    ME: "/auth/me",
  },
  USERS: {
    BASE: "/users",
    DETAIL: (id: string) => `/users/${id}`,
    PROFILE: "/users/profile",
  },
  DASHBOARD: {
    SUMMARY: "/dashboard/summary",
    ANALYTICS: "/dashboard/analytics",
    REVENUE: "/dashboard/revenue",
  },
  NOTIFICATIONS: {
    BASE: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
  },
  UPLOADS: {
    IMAGE: "/uploads/image",
    FILE: "/uploads/file",
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
