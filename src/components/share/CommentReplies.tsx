import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetRepliesByCommentId } from "@/hooks/usecomment";
import dayjs from "dayjs";
import { ThumbsUp } from "lucide-react";

const CommentReplies = ({
  comment,
  visibleRepliesCount,
  handleToggleReplies,
  renderText,
  handleShowLikesModal,
}: any) => {
  const { data: repliesResponse } = useGetRepliesByCommentId(comment._id);
  const repliesData =
    repliesResponse?.pages?.flatMap((page: any) => page.data || []) || [];

  const totalReplies = repliesData.length;
  const visibleReplies = visibleRepliesCount[comment._id] || 0;
  const isAllRepliesShown = visibleReplies >= totalReplies;

  const sortedReplies = [...repliesData].sort((a: any, b: any) =>
    dayjs(b.createdAt).diff(dayjs(a.createdAt)),
  );
  const displayedReplies = sortedReplies.slice(0, visibleReplies);

  if (totalReplies === 0) return null;

  return (
    <>
      <div className="mt-3 space-y-4 ml-6">
        {displayedReplies.map((reply: any) => (
          <div key={reply._id} className="flex gap-2.5 group">
            <Avatar className="h-6 w-6 shrink-0 mt-0.5">
              <AvatarImage src={reply.authorId?.avatar} />
              <AvatarFallback className="uppercase text-[10px] font-semibold bg-gray-200">
                {`${reply.authorId?.firstName?.charAt(0) || "U"}${reply.authorId?.lastName?.charAt(0) || ""}`}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-slate-100 border border-slate-200/50 px-3.5 py-2 rounded-2xl text-[13px] inline-block max-w-[95%] relative mb-0.5">
                <div className="font-semibold text-slate-800 leading-tight">
                  {reply.authorId?.firstName} {reply.authorId?.lastName}
                </div>
                <div className="text-slate-700 mt-0.5 mb-0.5 leading-snug whitespace-pre-wrap">
                  {renderText(reply.text, reply._id)}
                </div>

                {reply.replyCommentTotalLikes > 0 && (
                  <div
                    onClick={() => handleShowLikesModal(reply._id, "reply")}
                    className="absolute -right-2 -bottom-2.5 flex items-center border border-slate-200 bg-white shadow-sm rounded-full px-1.5 py-[2px] cursor-pointer group-hover:border-slate-300 transition-transform hover:scale-105"
                  >
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
    </>
  );
};

export default CommentReplies;
