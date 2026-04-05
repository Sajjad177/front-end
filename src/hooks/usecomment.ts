import {
  generateTempId,
  insertCommentOptimistically,
  insertReplyOptimistically,
  replaceTempCommentId,
  replaceTempReplyId,
} from "@/lib/cacheUtils";
import {
  addReplyToComment,
  createComment,
  getCommentByPostId,
  getCommentReplyByCommentId,
} from "@/services/commentService";
import { Author, Comment, Reply } from "@/types/models";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

type CreateCommentVars = {
  data: { text: string; postId: string };
  token: string;
};

export const useCommentPost = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<Comment, Error, CreateCommentVars>({
    mutationFn: async ({ data, token }) => {
      const res: any = await createComment(data, token);
      return res?.data || res?.comment || res;
    },
    onMutate: async ({ data }) => {
      await queryClient.cancelQueries({ queryKey: ["commentsByPostId", data.postId] });
      await queryClient.cancelQueries({ queryKey: ["allPosts"] });

      const tempId = generateTempId();

      const author: Author | undefined = session?.user
        ? {
            _id: (session.user as any).id || "",
            firstName: (session.user as any).firstName || "",
            lastName: (session.user as any).lastName || "",
            
          }
        : undefined;

      const newTempComment: Comment = {
        _id: tempId,
        text: data.text,
        postId: data.postId,
        authorId: author,
        liked: false,
        commentTotalLikes: 0,
        createdAt: new Date().toISOString(),
      };

      const previousComments = queryClient.getQueryData(["commentsByPostId", data.postId]);
      const previousPosts = queryClient.getQueryData(["allPosts"]);

      insertCommentOptimistically(queryClient, data.postId, newTempComment);

      return { tempId, previousComments, previousPosts, postId: data.postId };
    },
    onError: (err, _vars, context: any) => {
      if (context?.previousComments && context.postId) {
        queryClient.setQueryData(["commentsByPostId", context.postId], context.previousComments);
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(["allPosts"], context.previousPosts);
      }
      toast.error(err?.message || "Failed to post comment");
    },
    onSuccess: (realComment, { data }, context: any) => {
      const ensuredComment = { ...realComment };
      if (session?.user && !ensuredComment.authorId) {
        ensuredComment.authorId = {
           _id: (session.user as any).id || "",
           firstName: (session.user as any).firstName || "",
           lastName: (session.user as any).lastName || "",
        };
      }
      
      const tempId = context?.tempId;
      if (tempId) {
        replaceTempCommentId(queryClient, data.postId, tempId, ensuredComment);
      }
    },
  });
};

export const useGetCommentByPostId = (postId: string) => {
  return useInfiniteQuery({
    queryKey: ["commentsByPostId", postId],
    queryFn: ({ pageParam }) => getCommentByPostId(postId, pageParam as any),
    getNextPageParam: (lastPage: any) => lastPage.meta.nextCursor || undefined,
    initialPageParam: undefined,
  });
};


type AddReplyVars = {
  data: { text: string; commentId: string; postId: string };
  token: string;
};

export const useAddReplyToComment = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<Reply, Error, AddReplyVars>({
    mutationFn: async ({ data, token }) => {
      const res: any = await addReplyToComment(data, token);
      return res?.data || res?.reply || res;
    },
    onMutate: async ({ data }) => {
      await queryClient.cancelQueries({ queryKey: ["repliesByCommentId", data.commentId] });
      await queryClient.cancelQueries({ queryKey: ["allPosts"] });

      const tempId = generateTempId();

      const author: Author | undefined = session?.user
        ? {
            _id: (session.user as any).id || "",
            firstName: (session.user as any).firstName || "",
            lastName: (session.user as any).lastName || "",
            
          }
        : undefined;

      const newTempReply: Reply = {
        _id: tempId,
        text: data.text,
        commentId: data.commentId,
        postId: data.postId,
        authorId: author,
        liked: false,
        replyCommentTotalLikes: 0,
        createdAt: new Date().toISOString(),
      };

      const previousReplies = queryClient.getQueryData(["repliesByCommentId", data.commentId]);
      const previousPosts = queryClient.getQueryData(["allPosts"]);

      insertReplyOptimistically(queryClient, data.commentId, data.postId, newTempReply);

      return { tempId, previousReplies, previousPosts, commentId: data.commentId, postId: data.postId };
    },
    onError: (err, _vars, context: any) => {
      if (context?.previousReplies && context.commentId) {
        queryClient.setQueryData(["repliesByCommentId", context.commentId], context.previousReplies);
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(["allPosts"], context.previousPosts);
      }
      toast.error(err?.message || "Failed to add reply");
    },
    onSuccess: (realReply, { data }, context: any) => {
      const ensuredReply = { ...realReply };
      if (session?.user && !ensuredReply.authorId) {
        ensuredReply.authorId = {
           _id: (session.user as any).id || "",
           firstName: (session.user as any).firstName || "",
           lastName: (session.user as any).lastName || "",
        };
      }
      
      const tempId = context?.tempId;
      if (tempId) {
        replaceTempReplyId(queryClient, data.commentId, tempId, ensuredReply);
      }
    },
  });
};

export const useGetRepliesByCommentId = (commentId: string) => {
  return useInfiniteQuery({
    queryKey: ["repliesByCommentId", commentId],
    queryFn: ({ pageParam }) => getCommentReplyByCommentId(commentId, pageParam as any),
    getNextPageParam: (lastPage: any) => lastPage.meta.nextCursor || undefined,
    initialPageParam: undefined,
  });
};
