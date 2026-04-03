/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPost } from "@/services/postService";
import { useMutation } from "@tanstack/react-query";

type CreatePostVars = {
  formData: FormData;
  token?: string;
};

export const usePost = () => {
  return useMutation<any, Error, CreatePostVars>({
    mutationFn: async (vars) => {
      if (!vars) throw new Error("No data provided to create post");
      const { formData, token } = vars;
      return createPost(formData, token ?? "");
    },
  });
};