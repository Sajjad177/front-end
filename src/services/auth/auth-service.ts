import { apiClient } from "../api/api-client";
import { API_ENDPOINTS } from "@/constants/api";
import { ApiResponse, User } from "@/types";
import { LoginInput, RegisterInput, ForgotPasswordInput, OtpInput, ResetPasswordInput } from "@/schemas";

export interface AuthResponseData {
  token: string;
  refreshToken: string;
  user: User;
}

export const authService = {
  login: async (data: LoginInput): Promise<ApiResponse<AuthResponseData>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  register: async (data: RegisterInput): Promise<ApiResponse<AuthResponseData>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  forgotPassword: async (data: ForgotPasswordInput): Promise<ApiResponse<void>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  verifyOtp: async (data: OtpInput): Promise<ApiResponse<{ tempToken: string }>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
  },

  resetPassword: async (data: ResetPasswordInput): Promise<ApiResponse<void>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    return apiClient.get(API_ENDPOINTS.AUTH.ME);
  },
};
