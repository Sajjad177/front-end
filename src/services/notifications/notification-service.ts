import { apiClient } from "../api/api-client";
import { API_ENDPOINTS } from "@/constants/api";
import { ApiResponse, PaginatedResponse } from "@/types";

export interface DbNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const notificationService = {
  getNotifications: async (page = 1, limit = 10): Promise<PaginatedResponse<DbNotification>> => {
    return apiClient.get(API_ENDPOINTS.NOTIFICATIONS.BASE, {
      params: { page, limit },
    });
  },

  markAsRead: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  },

  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    return apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  },
};
