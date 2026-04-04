/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useAddReplyToComment,
  useGetRepliesByCommentId,
} from "@/hooks/usecomment";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Send } from "lucide-react";
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

  const { mutate: addReply, isPending: isReplying } = useAddReplyToComment();
  const { data: repliesData } = useGetRepliesByCommentId(comment._id);

  const allReplies = repliesData?.pages.flatMap((page: any) => page.data) || [];

  const sortedReplies = [...allReplies].sort((a, b) =>
    dayjs(a.createdAt).diff(dayjs(b.createdAt)),
  );

  const displayedReplies = sortedReplies.slice(0, visibleCount);

  const handleSendReply = async () => {
    if (!replyInput.trim()) return;

    try {
      await addReply({
        data: {
          commentId: comment._id,
          postId,
          text: replyInput,
        },
        token: session?.accessToken,
      });

      setReplyInput("");
      setShowReplyInput(false);
      toast.success("Your reply has been added!");
    } catch (error: any) {
      console.error("Reply error:", error);
      toast.error(error?.message || "Failed to add reply");
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleShowLess = () => {
    setVisibleCount(1);
  };

  return (
    <>
      {/* Action Row */}
      <div className="flex items-center gap-3 mt-1 ml-2 text-[12px] font-bold text-gray-500">
        <button className="hover:text-blue-600 cursor-pointer">Like.</button>

        <button
          onClick={() => setShowReplyInput(!showReplyInput)}
          className="hover:text-blue-600 cursor-pointer"
        >
          Reply.
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
              <div className="bg-gray-100 px-3 py-2 rounded-xl text-[12px]">
                <div className="font-semibold text-gray-900">
                  {reply.authorId?.firstName}
                </div>
                <div className="text-gray-800">{reply.text}</div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1 ml-1 text-[11px] font-semibold text-gray-500">
                <button className="hover:text-blue-600 cursor-pointer">
                  Like.
                </button>
                <button className="hover:text-blue-600 cursor-pointer">
                  Reply.
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

        {/* View More / View Less */}
        {sortedReplies.length > visibleCount && (
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
              : `View ${sortedReplies.length - visibleCount} more replies`}
          </button>
        )}
      </div>
    </>
  );
};

export default ReplySection;
