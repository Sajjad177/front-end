import { apiClient } from "../api/api-client";
import { API_ENDPOINTS } from "@/constants/api";
import { ApiResponse } from "@/types";

export interface DashboardSummary {
  totalUsers: number;
  activeUsers: number;
  monthlyRevenue: number;
  conversionRate: number;
}

export interface AnalyticsDataPoint {
  date: string;
  visitors: number;
  clicks: number;
  conversions: number;
}

export const dashboardService = {
  getSummary: async (): Promise<ApiResponse<DashboardSummary>> => {
    return apiClient.get(API_ENDPOINTS.DASHBOARD.SUMMARY);
  },

  getAnalytics: async (): Promise<ApiResponse<AnalyticsDataPoint[]>> => {
    return apiClient.get(API_ENDPOINTS.DASHBOARD.ANALYTICS);
  },
};
