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

type ToggleCommentVars = { commentId: string; token: string; postId?: string };

export const useToggleLikeForComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, token }: ToggleCommentVars) =>
      toggleLikesForComment(commentId, token),

    // Optimistic update
    onMutate: async ({ commentId }: ToggleCommentVars) => {
      await queryClient.cancelQueries({ queryKey: ["allPosts"] });

      const previousAllPosts: any = queryClient.getQueryData(["allPosts"]);

      queryClient.setQueryData(["allPosts"], (oldData: any) => {
        if (!oldData) return oldData;

        const pages = oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((post: any) => {
            if (!post.comments) return post;

            const comments = post.comments.map((c: any) => {
              if (c._id !== commentId) return c;
              const newLiked = !c.liked;
              const newTotal = (c.commentTotalLikes ?? 0) + (newLiked ? 1 : -1);
              return { ...c, liked: newLiked, commentTotalLikes: newTotal };
            });

            return { ...post, comments };
          }),
        }));

        return { ...oldData, pages };
      });

      return { previousAllPosts };
    },

    // Rollback on error
    onError: (err: any, vars: ToggleCommentVars, context: any) => {
      if (context?.previousAllPosts) {
        queryClient.setQueryData(["allPosts"], context.previousAllPosts);
      }
      toast.error(err?.message || "Failed to toggle like");
    },

    // Final reconcile with backend response
    onSuccess: (res: any, vars: ToggleCommentVars) => {
      const commentId = vars.commentId;
      const apiLiked = res?.data?.liked;
      const allPosts = queryClient.getQueryData(["allPosts"]);

      queryClient.setQueryData(["allPosts"], (oldData: any) => {
        if (!oldData) return oldData;

        const pages = oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((post: any) => {
            if (!post.comments) return post;

            const comments = post.comments.map((c: any) => {
              if (c._id !== commentId) return c;

              // update liked and total from backend
              const newLiked = apiLiked;
              const newTotal = newLiked ? 1 : 0; // or backend returns exact count
              return { ...c, liked: newLiked, commentTotalLikes: newTotal };
            });

            return { ...post, comments };
          }),
        }));

        return { ...oldData, pages };
      });

      toast.success(res.message || (apiLiked ? "Liked!" : "Like removed"));
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
