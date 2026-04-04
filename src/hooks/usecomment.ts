/* eslint-disable @typescript-eslint/no-explicit-any */
import { createComment, getAllComment } from "@/services/commentService";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type CreateCommentVars = {
  data: FormData | Record<string, any>;
  token?: string;
};

export const useCommentPost = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<any, Error, CreateCommentVars>({
    mutationFn: async (vars) => {
      if (!vars) throw new Error("No data provided to create comment");
      const { data, token } = vars;
      return createComment(data, token ?? "");
    },
    onSuccess: (res, vars) => {
      const comment = res?.data || res?.comment || res;

      // try to locate postId from response or from submitted data
      let postId =
        comment?.postId || comment?.post?._id || res?.postId || res?.post?._id;
      if (!postId) {
        const payload: any = vars?.data;
        if (payload instanceof FormData)
          postId = payload.get("postId") as string;
        else if (payload && typeof payload === "object")
          postId = payload.postId;
      }

      if (!postId) return;

      // enrich author from session if missing
      if (session?.user && !comment.author?.firstName) {
        comment.author = {
          id: session.user.id,
          firstName: session.user.firstName,
          lastName: session.user.lastName,
        } as any;
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
    },
  });
};

export const useGetAllComment = () => {
  return useInfiniteQuery({
    queryKey: ["allComments"],
    queryFn: getAllComment,
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor || undefined,
    initialPageParam: undefined,
  });
};


