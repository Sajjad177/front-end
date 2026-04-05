/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetAllLikesForPost, useToggleLikeForPost } from "@/hooks/useLike";
import { useGetAllPost } from "@/hooks/usepost";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MessageSquare, MoreHorizontal, Share2, ThumbsUp } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import CommentModal from "./CommentModal";
import CommentSection from "./CommentSection";
import LikesModal from "./LikesModal";
import PostSkeleton from "./PostSkeleton";

dayjs.extend(relativeTime);

const PostedFeed = () => {
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>(
    {},
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetAllPost();
  const { data: session } = useSession();
  const token = session?.accessToken;
  const postData = data?.pages.flatMap((page: any) => page.data) || [];

  const { mutate: toggleLike } = useToggleLikeForPost();
  const [pendingLikes, setPendingLikes] = useState<Record<string, boolean>>({});

  const { mutateAsync: fetchLikes } = useGetAllLikesForPost();
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likesList, setLikesList] = useState<any[]>([]);
  const [likesModalLoading, setLikesModalLoading] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(
    null,
  );

  const handleLoadMore = () => {
    if (hasNextPage) fetchNextPage();
  };

  const toggleExpand = (postId: string) => {
    setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleToggleLike = (postId: string, token: string | undefined) => {
    if (!token) {
      toast.error("You must be logged in");
      return;
    }

    if (pendingLikes[postId]) return;
    setPendingLikes((p) => ({ ...p, [postId]: true }));

    toggleLike(
      { postId, token },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Toggled successfully");
        },
        onError: (err: any) => {
          toast.error(err?.message || "Something went wrong");
        },
        onSettled: () => {
          setPendingLikes((p) => {
            const next = { ...p };
            delete next[postId];
            return next;
          });
        },
      },
    );
  };

  const handleToggleLikesModal = async (postId: string) => {
    try {
      setShowLikesModal(true);
      setLikesModalLoading(true);
      const res: any = await fetchLikes(postId);

      const list = res?.data || [];
      setLikesList(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error fetching likes:", error);
      toast.error("Failed to load likes");
    } finally {
      setLikesModalLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <PostSkeleton key={n} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {postData.map((post: any) => {
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
                  className={`grid gap-1 rounded-xl overflow-hidden border border-gray-100 ${
                    post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                  }`}
                >
                  {post.images.slice(0, 4).map((img: any, index: number) => (
                    <div
                      key={img.public_id}
                      className={`relative w-full overflow-hidden bg-gray-100 ${
                        post.images.length === 3 && index === 0
                          ? "col-span-2 aspect-video"
                          : "aspect-square"
                      }`}
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
                <hr className="hover:flex border border-red-500" />
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg cursor-pointer">
                  <ThumbsUp className="w-5 h-5 text-blue-500" />
                  <span className="text-[14px] font-bold text-gray-700">
                    Like
                  </span>
                </button>
                <span
                  onClick={() => handleToggleLikesModal(post._id)}
                  className="text-[14px] font-bold text-gray-700 cursor-pointer hover:underline ml-3"
                >
                  {post.totalLikes}+
                </span>
              </div>
              <div className="flex items-center gap-3 text-[13px] text-gray-500">
                <span>{post.totalComments} Comment</span>
                <span>Share</span>
              </div>
              {/* Likes Modal */}
              <LikesModal
                show={showLikesModal}
                onClose={() => setShowLikesModal(false)}
                loading={likesModalLoading}
                likesList={likesList}
              />
            </div>
            {/* Actions */}
            <div className="grid grid-cols-3 gap-1 p-2 border-b border-gray-50">
              <button
                onClick={() => handleToggleLike(post._id, token)}
                disabled={Boolean(pendingLikes[post._id])}
                className={`flex items-center justify-center gap-2 py-2.5 hover:bg-[#F0F7FF] rounded-lg ${pendingLikes[post._id] ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <ThumbsUp className="w-5 h-5 text-blue-500" />
                <span className="text-[14px] font-bold text-gray-700">
                  Like
                </span>
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                <MessageSquare className="w-5 h-5 text-gray-500" />
                <span
                  onClick={() => setActiveCommentPostId(post._id)}
                  className="text-[14px] font-bold text-gray-700"
                >
                  Comment
                </span>
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                <Share2 className="w-5 h-5 text-gray-500" />
                <span className="text-[14px] font-bold text-gray-700">
                  Share
                </span>
              </button>
 
              <CommentModal
                postId={activeCommentPostId}
                show={Boolean(activeCommentPostId)}
                onClose={() => setActiveCommentPostId(null)}
              />
            </div>

            {/* Comment Section */}
            <CommentSection postId={post._id} session={session} />
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
