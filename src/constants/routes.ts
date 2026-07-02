export const ROUTES = {
  // Public Routes
  PUBLIC: {
    HOME: "/",
    ABOUT: "/about",
    PRICING: "/pricing",
    CONTACT: "/contact",
    BLOG: "/blog",
    FAQ: "/faq",
  },
  // Authentication Routes
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    OTP: "/otp",
    RESET_PASSWORD: "/reset-password",
  },
  // Dashboard Routes
  DASHBOARD: {
    OVERVIEW: "/dashboard/overview",
    PROFILE: "/dashboard/profile",
    USERS: "/dashboard/users",
    ANALYTICS: "/dashboard/analytics",
    BILLING: "/dashboard/billing",
    SETTINGS: "/dashboard/settings",
    NOTIFICATIONS: "/dashboard/notifications",
  },
} as const;

export type Routes = typeof ROUTES;
