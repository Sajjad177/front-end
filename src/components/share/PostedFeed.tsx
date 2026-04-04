/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCommentPost, useGetAllComment } from "@/hooks/usecomment";
import { useGetAllPost } from "@/hooks/usepost";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Camera,
  Heart,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Send,
  Share2,
  Smile,
  ThumbsUp,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

const PostedFeed = () => {
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>(
    {},
  );
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {},
  );
  // Track how many comments to show per post (defaults to 1)
  const [visibleCommentsCount, setVisibleCommentsCount] = useState<
    Record<string, number>
  >({});

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAllPost();
  const { data: session } = useSession();
  const token = session?.accessToken;
  const { mutate: commentPost } = useCommentPost();

  const postData = data?.pages.flatMap((page: any) => page.data) || [];

  const { data: commentsData } = useGetAllComment();
  const allComments =
    commentsData?.pages?.flatMap((page: any) => page.data) || [];

  const handleLoadMore = () => {
    if (hasNextPage) fetchNextPage();
  };

  const toggleExpand = (postId: string) => {
    setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleShowMoreComments = (postId: string) => {
    setVisibleCommentsCount((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 1) + 5,
    }));
  };

  const handleSendComment = async (postId: string) => {
    if (!commentInputs[postId]?.trim()) {
      toast.error("You can't send an empty comment.");
      return;
    }

    const comment = commentInputs[postId];
    commentPost(
      { data: { text: comment, postId }, token },
      {
        onSuccess: () => {
          setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
          toast.success("Comment created successfully!");
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to create comment.");
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      {postData.map((post: any) => {
        // Filter and sort comments for this specific post (Newest first)
        const postComments = allComments
          .filter((c: any) => c.postId === post._id)
          .sort((a: any, b: any) =>
            dayjs(b.createdAt).diff(dayjs(a.createdAt)),
          );

        const showCount = visibleCommentsCount[post._id] || 1;
        const displayedComments = postComments.slice(0, showCount);

        return (
          <div
            key={post._id}
            id={post._id}
            className="bg-white rounded-sm border border-gray-100 w-full overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={post.authorId?.avatar || "/images/my-avatar.jpg"}
                  />
                  <AvatarFallback>
                    {post.authorId?.firstName?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h4 className="text-[15px] font-bold text-gray-900">
                    {post.authorId?.firstName} {post.authorId?.lastName}
                  </h4>
                  <span className="text-[12px] text-gray-500">
                    {dayjs(post?.postTime).fromNow()} · {post.visibility}
                  </span>
                </div>
              </div>
              <button className="text-gray-400 hover:bg-gray-50 p-1.5 rounded-full">
                <MoreHorizontal className="w-5 h-5 cursor-pointer" />
              </button>
            </div>

            {/* Content & Images */}
            <div className="px-4 pb-3">
              <div className="text-[14px] text-gray-800 mb-4">
                {post?.text && (
                  <>
                    <span>
                      {expandedPosts[post._id] || post.text.length <= 250
                        ? post.text
                        : `${post.text.slice(0, 250)}... `}
                    </span>
                    {post.text.length > 250 && (
                      <button
                        onClick={() => toggleExpand(post._id)}
                        className="text-blue-600 font-bold ml-1 hover:underline cursor-pointer"
                      >
                        {expandedPosts[post._id] ? "See less" : "See more"}
                      </button>
                    )}
                  </>
                )}
              </div>
              {post.images?.length > 0 && (
                <div
                  className={`grid gap-1 rounded-xl overflow-hidden border border-gray-100 ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
                >
                  {post.images.slice(0, 4).map((img: any, index: number) => (
                    <div
                      key={img.public_id}
                      className={`relative w-full overflow-hidden bg-gray-100 ${post.images.length === 3 && index === 0 ? "col-span-2 aspect-video" : "aspect-square"}`}
                    >
                      <Image
                        src={img.url}
                        alt="Post Image"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                      {index === 3 && post.images.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer">
                          <span className="text-white text-xl font-bold">
                            +{post.images.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <div className="flex items-center -space-x-2">
                <div className="bg-blue-500 rounded-full p-1 border-2 border-white">
                  <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
                </div>
                <div className="bg-red-500 rounded-full p-1 border-2 border-white">
                  <Heart className="w-2.5 h-2.5 text-white fill-white" />
                </div>
                <span className="pl-4 text-[13px] text-gray-500 font-medium">
                  {post.totalLikes}+
                </span>
              </div>
              <div className="flex items-center gap-3 text-[13px] text-gray-500">
                <span>{post.totalComments} Comment</span>
                <span>Share</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-1 p-2 border-b border-gray-50">
              <button className="flex items-center justify-center gap-2 py-2.5 hover:bg-[#F0F7FF] rounded-lg cursor-pointer">
                <Smile className="w-5 h-5 text-yellow-500" />
                <span className="text-[14px] font-bold text-gray-700">
                  Haha
                </span>
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                <MessageSquare className="w-5 h-5 text-gray-500" />
                <span className="text-[14px] font-bold text-gray-700">
                  Comment
                </span>
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                <Share2 className="w-5 h-5 text-gray-500" />
                <span className="text-[14px] font-bold text-gray-700">
                  Share
                </span>
              </button>
            </div>

            {/* Comment Section (Matches Image Design) */}
            <div className="p-4 space-y-4">
              {/* Input Field */}
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={session?.user?.image || "/images/my-avatar.jpg"}
                  />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-2 flex items-center justify-between border">
                  <input
                    type="text"
                    placeholder="Write a comment"
                    value={commentInputs[post._id] || ""}
                    onChange={(e) =>
                      setCommentInputs((p) => ({
                        ...p,
                        [post._id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSendComment(post._id)
                    }
                    className="bg-transparent outline-none text-[13px] w-full"
                  />
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mic className="w-5 h-5 cursor-pointer" />
                    <Camera className="w-5 h-5 cursor-pointer" />
                    <button
                      onClick={() => handleSendComment(post._id)}
                      className="bg-blue-500 p-1.5 rounded-full text-white hover:bg-blue-600 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* View Previous Comments Toggle */}
              {postComments.length > showCount && (
                <button
                  onClick={() => handleShowMoreComments(post._id)}
                  className="text-[13px] font-semibold text-gray-600 hover:underline cursor-pointer px-1"
                >
                  View {postComments.length - showCount} previous comments
                </button>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {displayedComments.map((comment: any) => (
                  <div key={comment._id} className="flex gap-3 group">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={comment.authorId?.avatar} />
                      <AvatarFallback>
                        {comment.authorId?.firstName?.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      {/* Comment Bubble */}
                      <div className="bg-gray-50 rounded-2xl px-4 py-2 inline-block max-w-full relative">
                        <h5 className="text-[13px] font-bold text-gray-900 leading-tight">
                          {comment.authorId?.firstName}{" "}
                          {comment.authorId?.lastName}
                        </h5>
                        <p className="text-[13px] text-gray-800 mt-0.5">
                          {comment.text}
                        </p>

                        {/* Reaction Badge (matching your image) */}
                        <div className="absolute -right-3 -bottom-2 flex items-center bg-white shadow-sm border border-gray-100 rounded-full px-1 py-0.5">
                          <ThumbsUp className="w-2.5 h-2.5 text-blue-500 fill-blue-500 mr-0.5" />
                          <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                          <span className="text-[10px] ml-1 text-gray-500">
                            198
                          </span>
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="flex items-center gap-3 mt-1 ml-2 text-[12px] font-bold text-gray-500">
                        <button className="hover:text-blue-600 cursor-pointer">
                          Like.
                        </button>
                        <button className="hover:text-blue-600 cursor-pointer">
                          Reply.
                        </button>
                        <button className="hover:text-blue-600 cursor-pointer">
                          Share
                        </button>
                        <span className="font-normal text-gray-400">
                          .{dayjs(comment.createdAt).format("mm")}m
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Main Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 rounded-lg cursor-pointer bg-blue-500 text-white"
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "show more"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostedFeed;
