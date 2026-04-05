import { QueryClient } from "@tanstack/react-query";
import { InfiniteQueryData, Post, Comment, Reply } from "@/types/models";

export const updatePostInCache = (
  queryClient: QueryClient,
  postId: string,
  updateFn: (post: Post) => Post
) => {
  queryClient.setQueryData<InfiniteQueryData<Post>>(["allPosts"], (oldData) => {
    if (!oldData) return oldData;
    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        data: page.data.map((post) => (post._id === postId ? updateFn(post) : post)),
      })),
    };
  });
};

export const updateCommentInCache = (
  queryClient: QueryClient,
  postId: string,
  commentId: string,
  updateFn: (comment: Comment) => Comment
) => {
  // Update in commentsByPostId query
  queryClient.setQueryData<InfiniteQueryData<Comment>>(
    ["commentsByPostId", postId],
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.map((c) => (c._id === commentId ? updateFn(c) : c)),
        })),
      };
    }
  );

  // Update inline comments in allPosts query
  queryClient.setQueryData<InfiniteQueryData<Post>>(["allPosts"], (oldData) => {
    if (!oldData) return oldData;
    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        data: page.data.map((post) => ({
          ...post,
          comments: post.comments?.map((c) => (c._id === commentId ? updateFn(c) : c)),
        })),
      })),
    };
  });
};

export const updateReplyInCache = (
  queryClient: QueryClient,
  commentId: string,
  replyId: string,
  updateFn: (reply: Reply) => Reply
) => {
  queryClient.setQueryData<InfiniteQueryData<Reply>>(
    ["repliesByCommentId", commentId],
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.map((r) => (r._id === replyId ? updateFn(r) : r)),
        })),
      };
    }
  );
};

export const insertCommentOptimistically = (
  queryClient: QueryClient,
  postId: string,
  newComment: Comment
) => {
  // Insert into allPosts inline
  queryClient.setQueryData<InfiniteQueryData<Post>>(["allPosts"], (oldData) => {
    if (!oldData) return oldData;
    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        data: page.data.map((post) =>
          post._id === postId
            ? {
                ...post,
                totalComments: (post.totalComments || 0) + 1,
                comments: [newComment, ...(post.comments || [])],
              }
            : post
        ),
      })),
    };
  });

  // Insert into commentsByPostId
  queryClient.setQueryData<InfiniteQueryData<Comment>>(
    ["commentsByPostId", postId],
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page, index) =>
          index === 0 ? { ...page, data: [newComment, ...page.data] } : page
        ),
      };
    }
  );
};

export const replaceTempCommentId = (
  queryClient: QueryClient,
  postId: string,
  tempId: string,
  realComment: Comment
) => {
  updateCommentInCache(queryClient, postId, tempId, () => realComment);
};


export const insertReplyOptimistically = (
  queryClient: QueryClient,
  commentId: string,
  postId: string,
  newReply: Reply
) => {
  // Insert into replies
  queryClient.setQueryData<InfiniteQueryData<Reply>>(
    ["repliesByCommentId", commentId],
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page, index) =>
          index === 0 ? { ...page, data: [newReply, ...page.data] } : page
        ),
      };
    }
  );

  // Bump totalComments in post
  updatePostInCache(queryClient, postId, (post) => ({
    ...post,
    totalComments: (post.totalComments || 0) + 1,
  }));
};

export const replaceTempReplyId = (
  queryClient: QueryClient,
  commentId: string,
  tempId: string,
  realReply: Reply
) => {
  updateReplyInCache(queryClient, commentId, tempId, () => realReply);
};

export const generateTempId = () => `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
