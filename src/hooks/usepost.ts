import {
  createPost,
  getAllCommentByPostId,
  getAllPost,
} from "@/services/postService";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type CreatePostVars = {
  formData: FormData;
  token?: string;
};

export const usePost = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<any, Error, CreatePostVars>({
    mutationFn: async (vars) => {
      if (!vars) throw new Error("No data provided to create post");
      const { formData, token } = vars;
      return createPost(formData, token ?? "");
    },
    onSuccess: (newPost, vars) => {
      const formVisibility = vars.formData.get("visibility");
      const post = newPost?.data || newPost?.post || newPost;

      const enrichedPost: any = { ...post };
      const author = enrichedPost.authorId;
      const sessionUser = session?.user;
      if (
        sessionUser &&
        (!author || typeof author === "string" || !author.firstName)
      ) {
        enrichedPost.authorId = {
          _id: typeof author === "string" ? author : sessionUser.id,
          firstName: sessionUser.firstName,
          lastName: sessionUser.lastName,
        };
      }

      const isIncomplete =
        !enrichedPost?.text &&
        (!enrichedPost?.images || enrichedPost.images.length === 0);
      const postToInsert = isIncomplete
        ? { ...enrichedPost, __pending: true }
        : enrichedPost;

      if (formVisibility !== "private" && postToInsert.visibility !== "private") {
        queryClient.setQueryData(["allPosts"], (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any, idx: number) =>
              idx === 0 ? { ...page, data: [postToInsert, ...page.data] } : page,
            ),
          };
        });
      }

      if (isIncomplete) {
        setTimeout(
          () => queryClient.invalidateQueries({ queryKey: ["allPosts"] }),
          3000,
        );
        setTimeout(
          () => queryClient.invalidateQueries({ queryKey: ["allPosts"] }),
          10000,
        );
      }
    },
  });
};

export const useGetAllPost = () => {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  return useInfiniteQuery({
    queryKey: ["allPosts"],
    queryFn: ({ pageParam }) =>
      getAllPost({ pageParam: pageParam as string | undefined, token }),
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor || undefined,
    initialPageParam: undefined,
    enabled: !!token,
  });
};

export const useGetAllCommentByPostId = ({ postId }: { postId: string }) => {
  return useInfiniteQuery({
    queryKey: ["allComments", postId],
    queryFn: ({ pageParam = 1 }) =>
      getAllCommentByPostId({ postId, pageParam }),
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      if (lastPage?.data?.length === 5) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!postId,
  });
};
