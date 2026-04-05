/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getAllLikesForPost,
  toggleLikesForComment,
  toggleLikesForCommentReply,
  toggleLikesForPost,
} from "@/services/likesService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

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

export const useGetAllLikesForPost = () => {
  return useMutation({
    mutationFn: getAllLikesForPost,
  });
};

type ToggleCommentVars = {
  commentId: string;
  postId: string;
  token: string;
};

export const useToggleLikeForComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, token, postId }: ToggleCommentVars) => {
      let parentId = postId;
      if (!parentId) {
        const allPosts = queryClient.getQueryData(["allPosts"]) as any;
        if (allPosts) {
          for (const page of allPosts.pages) {
            for (const post of page.data) {
              if (post.comments?.some((c: any) => c._id === commentId)) {
                parentId = post._id;
                break;
              }
            }
            if (parentId) break;
          }
        }
      }

      return toggleLikesForComment(commentId, parentId ?? "", token ?? "");
    },

    onMutate: async ({ commentId }) => {
      await queryClient.cancelQueries({ queryKey: ["allPosts"] });

      const previousData = queryClient.getQueryData(["allPosts"]);

      queryClient.setQueryData(["allPosts"], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((post: any) => ({
              ...post,
              comments: post.comments?.map((c: any) => {
                if (c._id !== commentId) return c;

                const liked = !c.liked;
                return {
                  ...c,
                  liked,
                  commentTotalLikes:
                    (c.commentTotalLikes || 0) + (liked ? 1 : -1),
                };
              }),
            })),
          })),
        };
      });

      return { previousData };
    },
    onError: (err: any, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["allPosts"], context.previousData);
      }
      toast.error(err?.message || "Failed to toggle like");
    },

    onSuccess: (res, { commentId }) => {
      const apiLiked = res?.data?.liked;

      queryClient.setQueryData(["allPosts"], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((post: any) => ({
              ...post,
              comments: post.comments?.map((c: any) => {
                if (c._id !== commentId) return c;

                return {
                  ...c,
                  liked: apiLiked,
                };
              }),
            })),
          })),
        };
      });

      toast.success(res.message || "Updated");
    },
  });
};

type ToggleCommentReplyVars = {
  replyId: string;
  token?: string;
  postId?: string;
};

export const useToggleLikesForCommentReply = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, ToggleCommentReplyVars>({
    mutationFn: (vars: ToggleCommentReplyVars) =>
      toggleLikesForCommentReply(
        vars.replyId,
        vars.token ?? token ?? "",
        vars.postId ?? "",
      ),
    onSuccess: (data, vars) => {
      // Refresh the comment replies query for the parent post (if we have postId)
      if (vars.postId) {
        queryClient.invalidateQueries({
          queryKey: ["commentReplies", vars.postId],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["commentReplies"] });
      }

      toast.success((data as any).message || "Like toggled successfully");
    },
    onError: (error: any) => {
      console.error("Like toggle failed:", error);
      toast.error(error?.message || "Failed to toggle like");
    },
  });
};
