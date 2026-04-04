/* eslint-disable @typescript-eslint/no-explicit-any */
import { createComment, getCommentByPostId } from "@/services/commentService";
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
