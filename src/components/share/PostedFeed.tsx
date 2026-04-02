"use client";

import React from "react";
import posts from "@/data/posts.json";


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  MessageSquare,
  Share2,
  Smile,
  Camera,
  Mic,
  ThumbsUp,
  Heart,
} from "lucide-react";
import Image from "next/image";

const PostedFeed = () => {
  const postData = posts as any;

  return (
    <div className="space-y-4">
      {postData.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 w-full overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={post.user.avatar} />
                <AvatarFallback>{post.user.name.slice(0, 2)}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <h4 className="text-[15px] font-bold text-gray-900">
                  {post.user.name}
                </h4>
                <span className="text-[12px] text-gray-500">
                  {post.time} · {post.visibility}
                </span>
              </div>
            </div>

            <button className="text-gray-400 hover:bg-gray-50 p-1.5 rounded-full">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 pb-3">
            <p className="text-[14px] text-gray-800 mb-4">{post.content}</p>

            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={post.image}
                alt="Post"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <div className="flex items-center -space-x-2">
              <div className="bg-blue-500 rounded-full p-1 border-2 border-white">
                <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
              </div>
              <div className="bg-red-500 rounded-full p-1 border-2 border-white">
                <Heart className="w-2.5 h-2.5 text-white fill-white" />
              </div>
              <span className="pl-4 text-[13px] text-gray-500 font-medium">
                {post.likes}+
              </span>
            </div>

            <div className="flex items-center gap-3 text-[13px] text-gray-500">
              <span>{post.commentsCount} Comment</span>
              <span>{post.shares} Share</span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-1 p-2 border-b border-gray-50">
            <button className="flex items-center justify-center gap-2 py-2.5 hover:bg-[#F0F7FF] rounded-lg">
              <Smile className="w-5 h-5 text-yellow-500" />
              <span className="text-[14px] font-bold text-gray-700">Haha</span>
            </button>

            <button className="flex items-center justify-center gap-2 py-2.5 hover:bg-gray-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-gray-500" />
              <span className="text-[14px] font-bold text-gray-700">
                Comment
              </span>
            </button>

            <button className="flex items-center justify-center gap-2 py-2.5 hover:bg-gray-50 rounded-lg">
              <Share2 className="w-5 h-5 text-gray-500" />
              <span className="text-[14px] font-bold text-gray-700">Share</span>
            </button>
          </div>

          {/* Comment Input */}
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/images/my-avatar.jpg" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>

              <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-2 flex items-center justify-between border">
                <input
                  type="text"
                  placeholder="Write a comment"
                  className="bg-transparent outline-none text-[13px] w-full"
                />
                <div className="flex items-center gap-2 text-gray-400">
                  <Mic className="w-4 h-4 cursor-pointer" />
                  <Camera className="w-4 h-4 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Comments */}
            {post.comments.map((comment: any) => (
              <div key={comment.id} className="flex gap-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user.avatar} />
                </Avatar>

                <div className="flex-1">
                  <div className="bg-[#F3F5F7] rounded-2xl p-3">
                    <h5 className="text-[13px] font-bold">
                      {comment.user.name}
                    </h5>
                    <p className="text-[13px] text-gray-700">{comment.text}</p>
                  </div>

                  <div className="flex items-center gap-4 mt-1 ml-2 text-[11px] text-gray-500">
                    <span>Like</span>
                    <span>Reply</span>
                    <span>{comment.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostedFeed;
