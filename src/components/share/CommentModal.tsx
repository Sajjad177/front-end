"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommentPost } from "@/hooks/usecomment";
import { useGetAllCommentByPostId } from "@/hooks/usepost";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Camera, Mic, Send, ThumbsUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

type CommentModalProps = {
  show: boolean;
  onClose: () => void;
  postId: string | null;
};

const CommentModal = ({ show, onClose, postId }: CommentModalProps) => {
  const { data: session } = useSession() as any;
  const token = session?.accessToken;
  
  const { 
    data: commentsResponse, 
    isLoading,
    fetchNextPage,
    hasNextPage
  } = useGetAllCommentByPostId({ 
    postId: postId || "" 
  });
  
  const { mutate: commentPost } = useCommentPost();
  const [commentInput, setCommentInput] = useState("");
  
  // Pagination State
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(5);
  const [visibleRepliesCount, setVisibleRepliesCount] = useState<Record<string, number>>({});

  if (!show || !postId) return null;

  const commentsData = commentsResponse?.pages?.flatMap((page: any) => page.data || []) || [];
  
  const sortedComments = [...commentsData].sort((a: any, b: any) =>
    dayjs(b.createdAt).diff(dayjs(a.createdAt)),
  );
  
  const displayedComments = sortedComments.slice(0, visibleCommentsCount);

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
          const el = document.getElementById("comment-modal-input");
          if (el) el.style.height = "auto";
          // Reset comment view to see the new one
          setVisibleCommentsCount(5);
          toast.success("Comment created successfully!");
        },
        onError: (err: any) =>
          toast.error(err?.message || "Failed to create comment."),
      },
    );
  };

  const handleToggleComments = () => {
    if (visibleCommentsCount >= sortedComments.length) {
      if (hasNextPage) {
        fetchNextPage().then(() => {
          setVisibleCommentsCount(prev => prev + 5);
        });
      } else {
        setVisibleCommentsCount(5); // View less
      }
    } else {
      setVisibleCommentsCount(prev => prev + 5); // Normal local "View more"
    }
  };

  const handleToggleReplies = (commentId: string, totalReplies: number) => {
    setVisibleRepliesCount(prev => {
      const current = prev[commentId] || 0;
      if (current === 0) return { ...prev, [commentId]: 5 }; // View replies => show 5
      if (current >= totalReplies) return { ...prev, [commentId]: 0 }; // View less => Hide all
      return { ...prev, [commentId]: current + 5 }; // View more => show +5
    });
  };

  const isAllShown = visibleCommentsCount >= sortedComments.length && !hasNextPage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-modal-fade">
      <div className="w-full max-w-lg bg-white rounded-xl p-0 animate-modal-scale flex flex-col max-h-[85vh] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">Comments</h3>
          <button
            onClick={onClose}
            className="text-gray-500 cursor-pointer hover:bg-gray-100 rounded-full p-1.5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Comments List */}
        <div className="overflow-y-auto flex-1 p-4 no-scrollbar">
          {(sortedComments.length > 5 || hasNextPage) && (
            <button
              onClick={handleToggleComments}
              className="text-[13px] cursor-pointer font-semibold text-slate-500 hover:text-slate-800 transition-colors pb-4 flex items-center gap-2 group w-fit"
            >
              <div className="w-5 h-[1px] bg-slate-300 group-hover:bg-slate-400 transition-colors" />
              {isAllShown
                ? "View less comments"
                : "View more comments"}
            </button>
          )}

          {isLoading ? (
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : commentsData.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <div className="space-y-5">
              {displayedComments.map((comment: any) => {
                const totalReplies = comment.replies?.length || 0;
                const visibleReplies = visibleRepliesCount[comment._id] || 0;
                const isAllRepliesShown = visibleReplies >= totalReplies;
                
                // Sort replies (newest first)
                const sortedReplies = [...(comment.replies || [])].sort((a: any, b: any) =>
                  dayjs(b.createdAt).diff(dayjs(a.createdAt)),
                );
                const displayedReplies = sortedReplies.slice(0, visibleReplies);

                return (
                  <div key={comment._id} className="flex gap-3 group">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="uppercase text-[12px] font-semibold bg-[#e9f2ff] text-[#007AFF]">
                        {`${comment.user?.firstName?.charAt(0) || "U"}${comment.user?.lastName?.charAt(0) || ""}`}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      {/* Comment bubble */}
                      <div className="bg-slate-100 rounded-2xl px-3.5 py-2 inline-block max-w-[92%] relative border border-slate-200/50 mb-0.5">
                        <h5 className="text-[13px] font-semibold text-slate-800 leading-tight">
                          {comment.user?.firstName} {comment.user?.lastName}
                        </h5>
                        <p className="text-[14px] text-slate-700 mt-0.5 mb-0.5 whitespace-pre-wrap leading-snug">
                          {comment.text}
                        </p>

                        {comment.commentTotalLikes > 0 && (
                          <div className="absolute -right-2 -bottom-2.5 flex items-center bg-white border border-slate-200 rounded-full px-1.5 py-[2px] shadow-sm">
                            <ThumbsUp className="w-[11px] h-[11px] text-blue-500 fill-blue-500" />
                            <span className="text-[11px] ml-1 font-medium text-slate-600">
                              {comment.commentTotalLikes}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 mt-0.5 ml-3 text-[12px] font-semibold text-slate-500">
                        <span className="text-[12px] font-normal text-slate-400">
                          {dayjs(comment.createdAt).fromNow(true)}
                        </span>
                      </div>

                      {/* Replies */}
                      <div className="mt-3 space-y-4 ml-6">
                        {displayedReplies.map((reply: any) => (
                          <div key={reply._id} className="flex gap-2.5 group">
                            <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                              <AvatarFallback className="uppercase text-[10px] font-semibold bg-gray-200">
                                {`${reply.user?.firstName?.charAt(0) || "U"}${reply.user?.lastName?.charAt(0) || ""}`}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-slate-100 border border-slate-200/50 px-3.5 py-2 rounded-2xl text-[13px] inline-block max-w-[95%] relative mb-0.5">
                                <div className="font-semibold text-slate-800 leading-tight">
                                  {reply.user?.firstName} {reply.user?.lastName}
                                </div>
                                <div className="text-slate-700 mt-0.5 mb-0.5 leading-snug whitespace-pre-wrap">{reply.text}</div>
                                
                                {reply.replyCommentTotalLikes > 0 && (
                                  <div className="absolute -right-2 -bottom-2.5 flex items-center border border-slate-200 bg-white shadow-sm rounded-full px-1.5 py-[2px]">
                                    <ThumbsUp className="w-[11px] h-[11px] text-blue-500 fill-blue-500" />
                                    <span className="text-[11px] ml-1 font-medium text-slate-600">
                                      {reply.replyCommentTotalLikes}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-0.5 ml-3 text-[11px] font-semibold text-slate-500">
                                <span className="text-slate-400 font-normal">
                                  {dayjs(reply.createdAt).fromNow(true)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* View Replies Toggle */}
                      {totalReplies > 0 && (
                        <button
                          onClick={() => handleToggleReplies(comment._id, totalReplies)}
                          className="flex cursor-pointer items-center gap-2 text-[12px] font-semibold text-slate-500 hover:text-slate-800 transition-colors ml-6 mt-2 mb-1 group"
                        >
                          <div className="w-5 h-[1px] bg-slate-300 group-hover:bg-slate-400 transition-colors" />
                          {visibleReplies === 0
                            ? `View replies (${totalReplies})`
                            : isAllRepliesShown
                            ? "View less"
                            : `View more replies (${totalReplies - visibleReplies})`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom comments view more toggle */}
          {!isLoading && (sortedComments.length > 5 || hasNextPage) && displayedComments.length > 0 && !isAllShown && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleToggleComments}
                className="text-[13px] cursor-pointer font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View more comments
              </button>
            </div>
          )}
        </div>

        {/* Input Field below */}
        <div className="p-4 border-t bg-white rounded-b-xl">
          <div className="flex items-end gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={session?.user?.image || "/images/my-avatar.jpg"} />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-[20px] px-4 py-1.5 flex items-end justify-between focus-within:ring-2 focus-within:ring-slate-100 focus-within:border-slate-300 transition-all">
              <textarea
                id="comment-modal-input"
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
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
