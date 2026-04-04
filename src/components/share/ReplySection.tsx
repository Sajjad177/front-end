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
    if (!session?.accessToken) return toast.error("You must be logged in");

    if (pendingLikes[comment._id]) return;
    setPendingLikes((p) => ({ ...p, [comment._id]: true }));

    try {
      await toggleLike({ commentId: comment._id, token: session.accessToken });
    } finally {
      setPendingLikes((p) => {
        const next = { ...p };
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
      { replyId, postId },
      {
        // onSuccess: () => {
        //   toast.success("Toggled reply like");
        // },
        // onError: (err: any) => {
        //   toast.error(err?.message || "Failed to toggle reply like");
        // },
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
      <div className="flex items-center gap-3 mt-1 ml-2 text-[12px] font-bold text-gray-500">
        <button
          onClick={handelToggleLikeForComment}
          className={`flex items-center gap-1 hover:text-blue-600 cursor-pointer`}
        >
          Like
        </button>

        <button
          onClick={() => setShowReplyInput(!showReplyInput)}
          className="hover:text-blue-600 cursor-pointer"
        >
          Reply
        </button>

        <button className="hover:text-blue-600 cursor-pointer">Share</button>
      </div>

      {/* Reply Input */}
      {showReplyInput && (
        <div className="flex items-center gap-2 mt-2 ml-2">
          <input
            type="text"
            placeholder="Write a reply..."
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
            className="flex-1 bg-gray-100 px-3 py-1.5 rounded-full text-[12px] outline-none"
          />
          <button
            onClick={handleSendReply}
            disabled={isReplying}
            className="bg-blue-500 text-white p-1 rounded-full"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Reply List */}
      <div className="mt-2 space-y-2 ml-6">
        {displayedReplies.map((reply: any) => (
          <div key={reply._id} className="flex gap-2 ml-6 mt-1">
            <Avatar className="h-6 w-6 shrink-0">
              <AvatarImage src={reply.authorId?.avatar} />
              <AvatarFallback>
                {reply.authorId?.firstName?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="bg-gray-100 px-3 py-2 rounded-xl text-[12px] relative">
                <div className="font-semibold text-gray-900">
                  {reply.authorId?.firstName}
                </div>
                <div className="text-gray-800">{reply.text}</div>
                <div className="absolute -right-3 -bottom-2 flex items-center border border-red-600 bg-white rounded-full px-1 py-0.5">
                  <ThumbsUp className="w-2.5 h-2.5 text-blue-500 fill-blue-500 mr-0.5" />

                  <span className="text-[10px] ml-1 text-gray-500">
                    {reply?.replyCommentTotalLikes || 0}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1 ml-1 text-[11px] font-semibold text-gray-500">
                <button
                  onClick={() => handelToggleLikeForReply(reply._id)}
                  className="hover:text-blue-600 cursor-pointer flex items-center gap-1"
                >
                  Like
                </button>
                <button className="hover:text-blue-600 cursor-pointer">
                  Reply
                </button>
                <button className="hover:text-blue-600 cursor-pointer">
                  Share
                </button>

                <span className="text-gray-400">
                  {dayjs(reply.createdAt).fromNow()}
                </span>
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
            className="text-[12px] font-semibold text-gray-500 cursor-pointer hover:underline ml-6"
          >
            {visibleCount >= sortedReplies.length
              ? "View less replies"
              : `View ${Math.max(0, sortedReplies.length - visibleCount)} more replies`}
          </button>
        )}
      </div>
    </>
  );
};

export default ReplySection;
