/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useAddReplyToComment,
  useGetRepliesByCommentId,
} from "@/hooks/usecomment";
import {
  useToggleLikeForComment,
  useToggleLikesForCommentReply,
} from "@/hooks/useLike";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Send, ThumbsUp } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

const ReplySection = ({
  comment,
  session,
  postId,
}: {
  comment: any;
  session: any;
  postId: string;
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const [visibleCount, setVisibleCount] = useState(1);
  const [pendingReplyCommentLikes, setPendingReplyCommentLikes] = useState<
    Record<string, boolean>
  >({});

  const { mutate: addReply, isPending: isReplying } = useAddReplyToComment();
  const { data: repliesData } = useGetRepliesByCommentId(comment._id);

  const allReplies = repliesData?.pages.flatMap((page: any) => page.data) || [];
  const [pendingLikes, setPendingLikes] = useState<Record<string, boolean>>({});
  const { mutateAsync: toggleLike } = useToggleLikeForComment();

  const sortedReplies = [...allReplies].sort((a, b) =>
    dayjs(b.createdAt).diff(dayjs(a.createdAt)),
  );

  const { mutate: toggleReplyLike } = useToggleLikesForCommentReply(
    session?.accessToken ?? "",
  );

  const displayedReplies = sortedReplies.slice(0, visibleCount);

  // Send reply
  const handleSendReply = async () => {
    if (!replyInput.trim()) return;
    addReply(
      {
        data: { commentId: comment._id, postId, text: replyInput },
        token: session?.accessToken,
      },
      {
        onSuccess: () => {
          setReplyInput("");
          setShowReplyInput(false);
          toast.success("Your reply has been added!");
        },
        onError: (error: any) =>
          toast.error(error?.message || "Failed to add reply"),
      },
    );
  };

  const handleShowMore = () =>
    setVisibleCount((prev) => Math.min(prev + 5, sortedReplies.length));
  const handleShowLess = () => setVisibleCount(1);

  const handelToggleLikeForComment = async () => {
    console.log("DEBUG DATA:", {
      commentId: comment._id,
      postId: postId,
    });

    if (!session?.accessToken) {
      return toast.error("You must be logged in");
    }

    if (pendingLikes[comment._id]) return;

    setPendingLikes((prev) => ({
      ...prev,
      [comment._id]: true,
    }));

    try {
      await toggleLike({
        commentId: comment._id,
        postId: postId,
        token: session.accessToken,
      });
    } catch (error: any) {
      toast.error(error?.message || "Failed to toggle like");
    } finally {
      setPendingLikes((prev) => {
        const next = { ...prev };
        delete next[comment._id];
        return next;
      });
    }
  };

  const handelToggleLikeForReply = async (replyId: string) => {
    if (!session?.accessToken) return toast.error("You must be logged in");

    if (pendingReplyCommentLikes[replyId]) return;
    setPendingReplyCommentLikes((p) => ({ ...p, [replyId]: true }));

    toggleReplyLike(
      { replyId, postId, commentId: comment._id, token: session.accessToken },
      {
        onSettled: () => {
          setPendingReplyCommentLikes((p) => {
            const next = { ...p };
            delete next[replyId];
            return next;
          });
        },
      },
    );
  };
  return (
    <>
      {/* Action Row */}
      <div className="flex items-center gap-3 mt-0.5 ml-3 text-[12px] font-semibold text-slate-500">
        <span className="text-[12px] font-normal text-slate-400 hover:underline cursor-pointer">
          {dayjs(comment.createdAt).fromNow(true)}
        </span>
        <button
          onClick={handelToggleLikeForComment}
          className={`flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer`}
        >
          Like
        </button>

        <button
          onClick={() => setShowReplyInput(!showReplyInput)}
          className="hover:text-blue-600 transition-colors cursor-pointer"
        >
          Reply
        </button>

        <button className="hover:text-blue-600 transition-colors cursor-pointer">Share</button>
      </div>

      {/* Reply Input */}
      {showReplyInput && (
        <div className="flex items-start gap-2 mt-2 ml-3">
          <Avatar className="h-6 w-6 shrink-0 mt-0.5">
            <AvatarImage src={session?.user?.image || "/images/my-avatar.jpg"} />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex items-center bg-slate-50 border border-slate-200/80 rounded-[20px] px-3 py-1 focus-within:ring-2 focus-within:ring-slate-100 focus-within:border-slate-300 transition-all">
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
              className="flex-1 bg-transparent text-[13px] outline-none text-slate-700 placeholder:text-slate-400 min-w-0"
              autoFocus
            />
            <button
              onClick={handleSendReply}
              disabled={isReplying || !replyInput.trim()}
              className="ml-2 bg-blue-500 hover:bg-blue-600 transition-transform hover:scale-105 active:scale-95 text-white p-1.5 rounded-full disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Reply List */}
      <div className="mt-2 space-y-2 ml-6">
        {displayedReplies.map((reply: any) => (
          <div key={reply._id} className="flex gap-2.5 ml-6 mt-2 group">
            <Avatar className="h-6 w-6 shrink-0 mt-0.5">
              <AvatarImage src={reply.authorId?.avatar} />
              <AvatarFallback className="uppercase text-[10px] font-semibold">
                {`${reply.authorId?.firstName?.charAt(0) || ""}${reply.authorId?.lastName?.charAt(0) || ""}`}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="bg-slate-100 border border-slate-200/50 px-3.5 py-2 rounded-2xl text-[13px] inline-block max-w-[95%] relative mb-0.5">
                <div className="font-semibold text-slate-800 leading-tight">
                  {reply.authorId?.firstName} {reply.authorId?.lastName}
                </div>
                <div className="text-slate-700 mt-0.5 mb-0.5 leading-snug whitespace-pre-wrap">{reply.text}</div>
                
                {reply?.replyCommentTotalLikes > 0 && (
                  <div className="absolute -right-2 -bottom-2.5 flex items-center border border-slate-200 bg-white rounded-full px-1.5 py-[2px] transition-transform hover:scale-105 cursor-pointer">
                    <ThumbsUp className="w-[11px] h-[11px] text-blue-500 fill-blue-500" />
                    <span className="text-[11px] ml-1 font-medium text-slate-600">
                      {reply.replyCommentTotalLikes}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1 ml-3 text-[11px] font-semibold text-slate-500">
                <span className="text-slate-400 font-normal hover:underline cursor-pointer">
                  {dayjs(reply.createdAt).fromNow(true)}
                </span>
                <button
                  onClick={() => handelToggleLikeForReply(reply._id)}
                  className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1"
                >
                  Like
                </button>
                <button className="hover:text-blue-600 transition-colors cursor-pointer">
                  Reply
                </button>
                <button className="hover:text-blue-600 transition-colors cursor-pointer">
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}

        {sortedReplies.length > 1 && (
          <button
            onClick={
              visibleCount >= sortedReplies.length
                ? handleShowLess
                : handleShowMore
            }
            className="flex cursor-pointer items-center gap-2 text-[12px] font-semibold text-slate-500 hover:text-slate-800 transition-colors ml-6 mt-1 mb-1 group"
          >
            <div className="w-5 h-[1px] bg-slate-300 group-hover:bg-slate-400 transition-colors" />
            {visibleCount >= sortedReplies.length
              ? "Hide replies"
              : `View ${Math.max(0, sortedReplies.length - visibleCount)} more ${Math.max(0, sortedReplies.length - visibleCount) === 1 ? 'reply' : 'replies'}`}
          </button>
        )}
      </div>
    </>
  );
};

export default ReplySection;
