import React from "react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SidebarRight = () => {
  const friends = [
    {
      name: "Steve Jobs",
      role: "CEO of Apple",
      time: "5 minute ago",
      online: false,
    },
    { name: "Ryan Roslansky", role: "CEO of Linkedin", online: true },
    { name: "Dylan Field", role: "CEO of Figma", online: true },
    {
      name: "Steve Jobs",
      role: "CEO of Apple",
      time: "5 minute ago",
      online: false,
    },
    { name: "Ryan Roslansky", role: "CEO of Linkedin", online: true },
    { name: "Dylan Field", role: "CEO of Figma", online: true },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* --- You Might Like Section --- */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-gray-800">You Might Like</h3>
          <button className="text-[#007AFF] text-xs font-semibold hover:underline">
            See All
          </button>
        </div>

        <div className="flex flex-col items-center text-center gap-3">
          <Avatar className="h-20 w-20 border-2 border-gray-50">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>RS</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-gray-800">Radovan SkillArena</span>
            <span className="text-xs text-gray-400">
              Founder & CEO at Trophy
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full mt-2">
            <Button
              variant="ghost"
              className="bg-gray-50 text-gray-400 font-medium hover:bg-gray-100"
            >
              Ignore
            </Button>
            <Button className="bg-[#007AFF] hover:bg-[#0062cc] text-white font-medium">
              Follow
            </Button>
          </div>
        </div>
      </div>

      {/* --- Your Friends Section --- */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex-1">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-lg text-gray-800">Your Friends</h3>
          <button className="text-[#007AFF] text-xs font-semibold hover:underline">
            See All
          </button>
        </div>

        {/* Search Bar inside Sidebar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="input search text"
            className="pl-10 bg-[#F3F5F7] border-none rounded-full h-10 text-sm focus-visible:ring-0"
          />
        </div>

        <div className="space-y-6">
          {friends.map((friend, index) => (
            <div
              key={index}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  {friend.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-[#00D084] border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">
                    {friend.name}
                  </span>
                  <span className="text-[11px] text-gray-400 leading-tight">
                    {friend.role}
                  </span>
                </div>
              </div>

              {/* Online/Offline status text or dot */}
              {friend.time ? (
                <span className="text-[10px] text-gray-300">{friend.time}</span>
              ) : (
                !friend.online && (
                  <div className="h-2 w-2 bg-gray-200 rounded-full"></div>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;
