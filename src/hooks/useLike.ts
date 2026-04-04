/* eslint-disable @typescript-eslint/no-explicit-any */
import { toggleLikesForPost } from "@/services/likesService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ToggleLikeVars = {
  postId: string;
  token?: string;
};

export const useToggleLikeForPost = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, ToggleLikeVars>({
    mutationFn: async (vars) => {
      if (!vars) throw new Error("No variables provided to toggle like");
      const { postId, token } = vars;
      return toggleLikesForPost(postId, token ?? "");
    },
    onSuccess: (res, vars) => {
      const postId = vars.postId;

      queryClient.setQueryData(["allPosts"], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((post: any) => {
              if (post._id !== postId) return post;

              const apiTotal =
                (res as any)?.totalLikes ?? (res as any)?.likesCount;
              const apiLiked = (res as any)?.liked ?? (res as any)?.isLiked;

              const currentlyLiked = Boolean(post.liked);
              const newLiked =
                typeof apiLiked === "boolean" ? apiLiked : !currentlyLiked;
              const newTotal =
                typeof apiTotal === "number"
                  ? apiTotal
                  : (post.totalLikes || 0) +
                    (newLiked ? 1 : -1) * (currentlyLiked === newLiked ? 0 : 1);

              return {
                ...post,
                liked: newLiked,
                totalLikes: newTotal,
              };
            }),
          })),
        };
      });
    },
  });
};
