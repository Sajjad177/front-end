/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addReplyToComment,
  createComment,
  getCommentByPostId,
  getCommentReplyByCommentId,
} from "@/services/commentService";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type CreateCommentVars = {
  data: { text: string; postId: string };
  token: string;
};

export const useCommentPost = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<any, Error, CreateCommentVars>({
    mutationFn: async ({ data, token }) => {
      return createComment(data, token);
    },
    onSuccess: (res, { data: payload }) => {
      const comment = res?.data || res?.comment || res;
      const postId = payload.postId;

      if (session?.user && !comment.authorId) {
        comment.authorId = {
          _id: session.user.id,
          firstName: session.user.firstName,
          lastName: session.user.lastName,
        };
      }

      queryClient.setQueryData(["allPosts"], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((post: any) =>
              post._id === postId
                ? {
                    ...post,
                    totalComments: (post.totalComments || 0) + 1,
                    comments: [comment, ...(post.comments || [])],
                  }
                : post,
            ),
          })),
        };
      });

      queryClient.setQueryData(["commentsByPostId", postId], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any, index: number) =>
            index === 0
              ? {
                  ...page,
                  data: [comment, ...page.data],
                }
              : page,
          ),
        };
      });
    },
  });
};

export const useGetCommentByPostId = (postId: string) => {
  return useInfiniteQuery({
    queryKey: ["commentsByPostId", postId],
    queryFn: ({ pageParam }) => getCommentByPostId(postId, pageParam),
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor || undefined,
    initialPageParam: undefined,
  });
};

type AddReplyVars = {
  data: { text: string; commentId: string; postId: string };
  token: string;
};

export const useAddReplyToComment = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, AddReplyVars>({
    mutationFn: async ({ data, token }) => {
      return addReplyToComment(data, token);
    },
    onSuccess: (res, { data: payload }) => {
      if (payload.postId) {
        queryClient.setQueryData(
          ["commentsByPostId", payload.postId],
          (oldData: any) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                data: page.data.map((comment: any) =>
                  comment._id === payload.commentId
                    ? {
                        ...comment,
                        replies: [...(comment.replies || []), res?.data],
                      }
                    : comment,
                ),
              })),
            };
          },
        );
      }
    },
    onError: (error: any) => {
      console.error("Reply failed:", error?.message);
    },
  });
};

export const useGetRepliesByCommentId = (commentId: string) => {
  return useInfiniteQuery({
    queryKey: ["repliesByCommentId", commentId],
    queryFn: ({ pageParam }) =>
      getCommentReplyByCommentId(commentId, pageParam),
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor || undefined,
    initialPageParam: undefined,
  });
};
