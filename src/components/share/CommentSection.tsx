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

import { useGetAllLikesForComment } from "@/hooks/useLike";
import LikesModal from "./LikesModal";

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

  const [expandedText, setExpandedText] = useState<Record<string, boolean>>({});

  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likesList, setLikesList] = useState<any[]>([]);
  const [likesModalLoading, setLikesModalLoading] = useState(false);
  const { mutateAsync: fetchCommentLikes } = useGetAllLikesForComment();

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
          const el = document.getElementById("comment-section-input");
          if (el) el.style.height = "auto";
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

  const handleShowCommentLikes = async (commentId: string) => {
    try {
      setShowLikesModal(true);
      setLikesModalLoading(true);
      const res: any = await fetchCommentLikes(commentId);
      const list = res?.data || [];
      setLikesList(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error fetching comment likes:", error);
      toast.error("Failed to load likes");
    } finally {
      setLikesModalLoading(false);
    }
  };

  const toggleExpandText = (id: string) => {
    setExpandedText((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderText = (text: string, id: string) => {
    if (!text) return null;
    const words = text.split(/\s+/);
    if (words.length <= 40) return text;

    if (expandedText[id]) {
      return (
        <>
          {text}
          <button
            onClick={() => toggleExpandText(id)}
            className="text-blue-600 font-semibold ml-1 hover:underline cursor-pointer"
          >
            view less
          </button>
        </>
      );
    }

    return (
      <>
        {words.slice(0, 40).join(" ")}...
        <button
          onClick={() => toggleExpandText(id)}
          className="text-blue-600 font-semibold ml-1 hover:underline cursor-pointer"
        >
          see more
        </button>
      </>
    );
  };

  return (
    <div className="p-4 space-y-4">
      {/* Input Field */}
      <div className="flex items-end gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={session?.user?.image || "/images/my-avatar.jpg"} />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-[20px] px-4 py-1.5 mt-1 mb-1 flex items-end justify-between focus-within:ring-2 focus-within:ring-slate-100 focus-within:border-slate-300 transition-all">
          <textarea
            id="comment-section-input"
            rows={1}
            placeholder="Write a comment..."
            value={commentInput}
            onChange={(e) => {
              setCommentInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 46)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (commentInput.trim()) handleSendComment();
              }
            }}
            className="bg-transparent outline-none text-[14px] w-full text-slate-700 placeholder:text-slate-400 resize-none overflow-y-auto min-h-[20px] max-h-[46px] py-[2px] pr-2 no-scrollbar"
            style={{ lineHeight: "20px" }}
          />
          <div className="flex items-center gap-2.5 text-slate-400 pl-2 pb-[1px]">
            <Mic className="w-4 h-4 cursor-pointer hover:text-slate-600 transition-colors shrink-0" />
            <Camera className="w-4 h-4 cursor-pointer hover:text-slate-600 transition-colors shrink-0" />
            <button
              onClick={handleSendComment}
              disabled={!commentInput.trim()}
              className="bg-blue-500 cursor-pointer p-1.5 rounded-full text-white hover:bg-blue-600 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed ml-1 shrink-0"
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
                  {renderText(comment.text, comment._id)}
                </p>

                {/* Reaction Badge */}
                {comment.commentTotalLikes > 0 && (
                  <div 
                    onClick={() => handleShowCommentLikes(comment._id)}
                    className="absolute -right-2 -bottom-2.5 flex items-center bg-white border border-slate-200 rounded-full px-1.5 py-[2px] transition-transform hover:scale-105 cursor-pointer shadow-sm group-hover:border-slate-300"
                  >
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

      <LikesModal
        show={showLikesModal}
        onClose={() => setShowLikesModal(false)}
        loading={likesModalLoading}
        likesList={likesList}
      />
    </div>
  );
};

export default CommentSection;
