"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import userImg from "../../../public/user/user-9.jpg";

const friends = [
  {
    id: 1,
    name: "Steve Jobs",
    role: "CEO of Apple",
    time: "5 minute ago",
    online: false,
    img: "/user/user-1.jpg",
  },
  {
    id: 2,
    name: "Ryan Roslansky",
    role: "CEO of Linkedin",
    time: null,
    online: true,
    img: "/user/user-2.jpg",
  },
  {
    id: 3,
    name: "Dylan Field",
    role: "CEO of Figma",
    time: null,
    online: true,
    img: "/user/user-3.jpg",
  },
  {
    id: 4,
    name: "Steve Jobs",
    role: "CEO of Apple",
    time: "5 minute ago",
    online: false,
    img: "/user/user-4.jpg",
  },
  {
    id: 5,
    name: "Ryan Roslansky",
    role: "CEO of Linkedin",
    time: null,
    online: true,
    img: "/user/user-5.jpg",
  },
  {
    id: 6,
    name: "Dylan Field",
    role: "CEO of Figma",
    time: null,
    online: true,
    img: "/user/user-6.jpg",
  },
];

const SidebarRight = () => {
  return (
    <div className="flex flex-col gap-5 w-full max-w-[320px]">
      <div className="bg-white rounded-sm p-6  max-w-[350px]">

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-[22px] text-gray-900 tracking-tight">
            You Might Like
          </h3>
          <button className="text-[#007AFF] text-[14px]  font-semibold hover:underline">
            See All
          </button>
        </div>

        <hr className="border-gray-100 mb-8" />

        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-16 w-16">
            <AvatarImage src={userImg.src} className="object-cover" />
          </Avatar>

          <div className="flex flex-col">
            <h4 className="font-normal text-[19px] text-gray-900 leading-tight">
              Radovan SkillArena
            </h4>
            <p className="text-[14px] text-gray-400 mt-1">
              Founder & CEO at Trophy
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <Button className="border-gray-100 text-gray-400 font-bold h-12 hover:bg-gray-50 transition-all text-[15px] bg-white cursor-pointer rounded-sm">
            Ignore
          </Button>
          <Button className=" bg-[#4D81FF] hover:bg-[#3b6ee8] text-white font-bold h-12 shadow-md shadow-blue-100 transition-all text-[15px] cursor-pointer rounded-sm">
            Follow
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-sm p-6 flex-1">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-[19px] text-gray-900 tracking-tight">
            Your Friends
          </h3>
          <button className="text-[#007AFF] text-[13px] font-bold hover:underline">
            See All
          </button>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
          <Input
            placeholder="input search text"
            className="pl-11 bg-[#F3F5F7] border-none rounded-2xl h-[52px] text-[15px] placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-200"
          />
        </div>

        <div className="space-y-7">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-[46px] w-[46px]">
                    <AvatarImage src={friend.img} className="object-cover" />
                    <AvatarFallback className="font-bold">
                      {friend.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex flex-col">
                  <span className="text-[15px] font-bold text-gray-900 leading-none mb-1.5 group-hover:text-[#007AFF] transition-colors">
                    {friend.name}
                  </span>
                  <span className="text-[12px] text-gray-400 font-medium leading-none">
                    {friend.role}
                  </span>
                </div>
              </div>
              {friend.time && (
                <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                  {friend.time}
                </span>
              )}
              {friend.online && !friend.time && (
                <div className="h-[10px] w-[10px] bg-[#00D084] rounded-full mr-1"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;
