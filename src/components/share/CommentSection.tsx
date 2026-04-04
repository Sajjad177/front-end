/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCommentPost, useGetCommentByPostId } from "@/hooks/usecomment";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Camera, Mic, Send, ThumbsUp } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import ReplySection from "./ReplySection";

dayjs.extend(relativeTime);

const CommentSection = ({
  postId,
  session,
}: {
  postId: string;
  session: any;
}) => {
  const token = session?.accessToken;
  const { mutate: commentPost } = useCommentPost();
  const [commentInput, setCommentInput] = useState("");
  const [visibleCount, setVisibleCount] = useState(1);
  const { data: commentsData } = useGetCommentByPostId(postId);

  const allComments =
    commentsData?.pages.flatMap((page: any) => page.data) || [];

  const sortedComments = [...allComments].sort((a, b) =>
    dayjs(b.createdAt).diff(dayjs(a.createdAt)),
  );

  const displayedComments = sortedComments.slice(0, visibleCount);

  const handleSendComment = () => {
    if (!commentInput.trim()) {
      toast.error("You can't send an empty comment.");
      return;
    }
    commentPost(
      { data: { text: commentInput, postId }, token },
      {
        onSuccess: () => {
          setCommentInput("");
          toast.success("Comment created successfully!");
        },
        onError: (err: any) =>
          toast.error(err?.message || "Failed to create comment."),
      },
    );
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleShowLess = () => {
    setVisibleCount(1);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Input Field */}
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={session?.user?.image || "/images/my-avatar.jpg"} />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-2 flex items-center justify-between border">
          <input
            type="text"
            placeholder="Write a comment"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
            className="bg-transparent outline-none text-[13px] w-full"
          />
          <div className="flex items-center gap-2 text-gray-400">
            <Mic className="w-5 h-5 cursor-pointer" />
            <Camera className="w-5 h-5 cursor-pointer" />
            <button
              onClick={handleSendComment}
              className="bg-blue-500 cursor-pointer p-1.5 rounded-full text-white hover:bg-blue-600 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {sortedComments.length > 1 && (
        <button
          onClick={
            visibleCount >= sortedComments.length
              ? handleShowLess
              : handleShowMore
          }
          className="text-[13px] font-semibold text-gray-600 hover:underline cursor-pointer px-1"
        >
          {visibleCount >= sortedComments.length
            ? "View less comments"
            : `View ${sortedComments.length - visibleCount} previous comments`}
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
                  {comment.authorId?.firstName} {comment.authorId?.lastName}
                </h5>
                <p className="text-[13px] text-gray-800 mt-0.5">
                  {comment.text}
                </p>

                {/* Reaction Badge */}
                <div className="absolute -right-3 -bottom-2 flex items-center bg-white border border-gray-100 rounded-full px-1 py-0.5">
                  <ThumbsUp className="w-2.5 h-2.5 text-blue-500 fill-blue-500 mr-0.5" />

                  <span className="text-[10px] ml-1 text-gray-500">
                    {comment.commentTotalLikes || 0}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 mt-0.5">
                {dayjs(comment.createdAt).fromNow()}
              </span>

              <ReplySection
                comment={comment}
                session={session}
                postId={postId}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
