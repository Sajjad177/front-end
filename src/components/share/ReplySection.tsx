/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAddReplyToComment } from "@/hooks/usecomment";

import { Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const ReplySection = ({
  comment,
  session,
  postId,
}: {
  comment: any;
  session: any;
  postId: string;
}) => {
  const [showReply, setShowReply] = useState(false);
  const [replyInput, setReplyInput] = useState("");

  const { mutate: addReply, isPending } = useAddReplyToComment();

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
      setShowReply(false);

      toast.success("Your reply has been added!");
    } catch (error: any) {
      console.error("Reply error:", error);
      toast.error(error?.message || "Failed to add reply");
    }
  };
  return (
    <>
      {/* Action Row */}
      <div className="flex items-center gap-3 mt-1 ml-2 text-[12px] font-bold text-gray-500">
        <button className="hover:text-blue-600 cursor-pointer">Like.</button>

        <button
          onClick={() => setShowReply(!showReply)}
          className="hover:text-blue-600 cursor-pointer"
        >
          Reply.
        </button>

        <button className="hover:text-blue-600 cursor-pointer">Share</button>
      </div>

      {/* Reply Input */}
      {showReply && (
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
            disabled={isPending}
            className="bg-blue-500 text-white p-1 rounded-full"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Reply List */}
      {comment.replies?.map((reply: any) => (
        <div key={reply._id} className="flex gap-2 mt-2 ml-6">
          <Avatar className="h-6 w-6">
            <AvatarImage src={reply.authorId?.avatar} />
            <AvatarFallback>
              {reply.authorId?.firstName?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="bg-gray-100 px-3 py-1.5 rounded-xl text-[12px]">
            <span className="font-bold">{reply.authorId?.firstName}</span>{" "}
            {reply.text}
          </div>
        </div>
      ))}
    </>
  );
};

export default ReplySection;
