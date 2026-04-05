/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  updateCommentInCache,
  updatePostInCache,
  updateReplyInCache,
} from "@/lib/cacheUtils";
import {
  getAllLikesForPost,
  getLikesByCommentId,
  getLikesByCommentReplyId,
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
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ["allPosts"] });
      const previousData = queryClient.getQueryData(["allPosts"]);

      updatePostInCache(queryClient, postId, (post) => {
        const currentlyLiked = Boolean(post.liked);
        const newLiked = !currentlyLiked;
        const newTotal = (post.totalLikes || 0) + (newLiked ? 1 : -1);

        return {
          ...post,
          liked: newLiked,
          totalLikes: newTotal,
        };
      });

      return { previousData };
    },
    onError: (err: any, _vars, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(["allPosts"], context.previousData);
      }
      toast.error(err?.message || "Failed to toggle like");
    },
    onSuccess: (res: any, { postId }) => {
      const apiTotal = res?.totalLikes ?? res?.likesCount;
      const apiLiked = res?.liked ?? res?.isLiked;

      updatePostInCache(queryClient, postId, (post) => ({
        ...post,
        liked: typeof apiLiked === "boolean" ? apiLiked : post.liked,
        totalLikes: typeof apiTotal === "number" ? apiTotal : post.totalLikes,
      }));
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
      return toggleLikesForComment(commentId, postId, token);
    },
    onMutate: async ({ commentId, postId }) => {
      await queryClient.cancelQueries({ queryKey: ["allPosts"] });
      if (postId) {
        await queryClient.cancelQueries({ queryKey: ["commentsByPostId", postId] });
      }

      const previousData = queryClient.getQueryData(["allPosts"]);
      const previousComments = postId ? queryClient.getQueryData(["commentsByPostId", postId]) : undefined;

      updateCommentInCache(queryClient, postId, commentId, (c) => {
        const liked = !c.liked;
        return {
          ...c,
          liked,
          commentTotalLikes: (c.commentTotalLikes || 0) + (liked ? 1 : -1),
        };
      });

      return { previousData, previousComments, postId };
    },
    onError: (err: any, _vars, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(["allPosts"], context.previousData);
      }
      if (context?.previousComments && context.postId) {
        queryClient.setQueryData(["commentsByPostId", context.postId], context.previousComments);
      }
      toast.error(err?.message || "Failed to toggle like");
    },
    onSuccess: (res: any, { commentId, postId }) => {
      const apiLiked = res?.data?.liked;

      updateCommentInCache(queryClient, postId, commentId, (c) => ({
        ...c,
        liked: apiLiked !== undefined ? apiLiked : c.liked,
      }));

      toast.success(res.message || "Updated");
    },
  });
};

type ToggleCommentReplyVars = {
  replyId: string;
  token?: string;
  postId?: string;
  commentId?: string;
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
    onMutate: async ({ replyId, commentId }) => {
      if (!commentId) return {};

      await queryClient.cancelQueries({ queryKey: ["repliesByCommentId", commentId] });
      const previousReplies = queryClient.getQueryData(["repliesByCommentId", commentId]);

      updateReplyInCache(queryClient, commentId, replyId, (r) => {
        const liked = !r.liked;
        return {
          ...r,
          liked,
          replyCommentTotalLikes: (r.replyCommentTotalLikes || 0) + (liked ? 1 : -1),
        };
      });

      return { previousReplies, commentId };
    },
    onError: (error: any, _vars, context: any) => {
      if (context?.previousReplies && context?.commentId) {
        queryClient.setQueryData(["repliesByCommentId", context.commentId], context.previousReplies);
      }
      console.error("Like toggle failed:", error);
      toast.error(error?.message || "Failed to toggle like");
    },
    onSuccess: (data: any, vars) => {
      const apiLiked = data?.data?.liked;
      if (vars.commentId) {
        updateReplyInCache(queryClient, vars.commentId, vars.replyId, (r) => ({
          ...r,
          liked: apiLiked !== undefined ? apiLiked : r.liked,
        }));
      }

      toast.success(data.message || "Like toggled successfully");
    },
  });
};



export const useGetAllLikesForComment = () => {
  return useMutation({
    mutationFn: getLikesByCommentId,
  });
};


export const useGetAllLikesForCommentReply = () => {
  return useMutation({
    mutationFn: getLikesByCommentReplyId,
  });
};
