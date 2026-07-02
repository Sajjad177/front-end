import { apiClient } from "../api/api-client";
import { API_ENDPOINTS } from "@/constants/api";
import { ApiResponse } from "@/types";

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

export const uploadService = {
  uploadImage: async (file: File, progressCallback?: (progress: number) => void): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post(API_ENDPOINTS.UPLOADS.IMAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressCallback && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          progressCallback(progress);
        }
      },
    });
  },

  uploadFile: async (file: File): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post(API_ENDPOINTS.UPLOADS.FILE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
