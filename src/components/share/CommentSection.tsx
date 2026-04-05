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
        <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-[20px] px-4 py-1.5 mt-1 mb-1 flex items-center justify-between focus-within:ring-2 focus-within:ring-slate-100 focus-within:border-slate-300 transition-all">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
            className="bg-transparent outline-none text-[14px] w-full text-slate-700 placeholder:text-slate-400"
          />
          <div className="flex items-center gap-2.5 text-slate-400 pl-2">
            <Mic className="w-4 h-4 cursor-pointer hover:text-slate-600 transition-colors" />
            <Camera className="w-4 h-4 cursor-pointer hover:text-slate-600 transition-colors" />
            <button
              onClick={handleSendComment}
              disabled={!commentInput.trim()}
              className="bg-blue-500 cursor-pointer p-1.5 rounded-full text-white hover:bg-blue-600 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed ml-1"
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
          className="text-[13px] cursor-pointer font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1 flex items-center gap-2 group w-fit ml-1"
        >
          {visibleCount >= sortedComments.length
            ? "Hide previous comments"
            : `View ${sortedComments.length - visibleCount} previous ${sortedComments.length - visibleCount === 1 ? 'comment' : 'comments'}`}
        </button>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {displayedComments.map((comment: any) => (
          <div key={comment._id} className="flex gap-3 group">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={comment.authorId?.avatar} />
              <AvatarFallback className="uppercase text-[12px] font-semibold">
                {`${comment.authorId?.firstName?.charAt(0) || ""}${comment.authorId?.lastName?.charAt(0) || ""}`}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {/* Comment Bubble */}
              <div className="bg-slate-100 rounded-2xl px-3.5 py-2 inline-block max-w-[92%] relative border border-slate-200/50 mb-0.5">
                <h5 className="text-[13px] font-semibold text-slate-800 leading-tight">
                  {comment.authorId?.firstName} {comment.authorId?.lastName}
                </h5>
                <p className="text-[14px] text-slate-700 mt-0.5 mb-0.5 whitespace-pre-wrap leading-snug">
                  {comment.text}
                </p>

                {/* Reaction Badge */}
                {comment.commentTotalLikes > 0 && (
                  <div className="absolute -right-2 -bottom-2.5 flex items-center bg-white border border-slate-200 rounded-full px-1.5 py-[2px] transition-transform hover:scale-105 cursor-pointer">
                    <ThumbsUp className="w-[11px] h-[11px] text-blue-500 fill-blue-500" />
                    <span className="text-[11px] ml-1 font-medium text-slate-600">
                      {comment.commentTotalLikes}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-1.5">


              <ReplySection
                comment={comment}
                session={session}
                postId={postId}
              />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
