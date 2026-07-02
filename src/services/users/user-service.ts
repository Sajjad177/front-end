import { apiClient } from "../api/api-client";
import { API_ENDPOINTS } from "@/constants/api";
import { ApiResponse, User, UserProfile } from "@/types";
import { UpdateProfileInput, ChangePasswordInput } from "@/schemas";

export const userService = {
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    return apiClient.get(API_ENDPOINTS.USERS.PROFILE);
  },

  updateProfile: async (data: UpdateProfileInput): Promise<ApiResponse<UserProfile>> => {
    return apiClient.put(API_ENDPOINTS.USERS.PROFILE, data);
  },

  changePassword: async (data: ChangePasswordInput): Promise<ApiResponse<void>> => {
    return apiClient.post(`${API_ENDPOINTS.USERS.BASE}/change-password`, data);
  },

  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    return apiClient.get(API_ENDPOINTS.USERS.DETAIL(id));
  },
};
