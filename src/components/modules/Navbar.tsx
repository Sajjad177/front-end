"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Bell,
  ChevronDown,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import userImg from "../../../public/user/img.webp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Navbar = () => {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <>
      <header className="w-full bg-white border-b sticky top-0 z-50 h-16 md:h-20 flex items-center">
        <div className="max-w-[1400px] mx-auto px-4 w-full flex items-center justify-between">
          <div className="flex items-center gap-1 font-bold text-xl cursor-pointer min-w-fit">
            <div className="bg-[#007AFF] text-white p-1 rounded-md flex items-center justify-center h-8 w-8">
              <span className="text-lg leading-none">B</span>
            </div>
            <span className="text-[#007AFF] tracking-tight">Buddy</span>
            <span className="text-[#8EBEFF] font-medium tracking-tight">
              Script
            </span>
          </div>

          <div className="hidden md:flex flex-1 justify-center px-8">
            <div className="relative w-full max-w-[420px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="input search text"
                className="pl-11 bg-[#F3F5F7] border-none rounded-full h-10 w-full text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex items-center lg:gap-12 gap-6  pr-6">
              <div className="relative h-20 flex items-center">
                <Home className="h-6 w-6 text-[#007AFF] cursor-pointer" />
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#007AFF] rounded-t-full" />
              </div>
              <Users className="h-6 w-6 text-gray-400 cursor-pointer" />

              <div className="relative cursor-pointer">
                <Bell className="h-6 w-6 text-gray-400" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#007AFF] text-[10px] text-white font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center border-2 border-white">
                  6
                </span>
              </div>

              <div className="relative cursor-pointer">
                <MessageCircle className="h-6 w-6 text-gray-400" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#007AFF] text-[10px] text-white font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center border-2 border-white">
                  2
                </span>
              </div>
            </div>

            <Search className="h-6 w-6 text-gray-500 md:hidden cursor-pointer" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="hidden lg:flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity outline-none">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userImg.src} />
                    <AvatarFallback>DF</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold text-gray-800">
                    Dylan Field
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>My Posts</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex items-center justify-around px-4 z-50 md:hidden">
        <div className="relative h-full flex flex-col items-center justify-center min-w-[50px]">
          <Home className="h-7 w-7 text-[#007AFF]" />
          <div className="absolute top-0 w-full h-[3px] bg-[#007AFF] rounded-b-full" />
        </div>
        <Users className="h-7 w-7 text-gray-400" />
        <div className="relative">
          <Bell className="h-7 w-7 text-gray-400" />
          <span className="absolute -top-1 -right-1 bg-[#007AFF] text-[10px] text-white rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
            6
          </span>
        </div>
        <div className="relative">
          <MessageCircle className="h-7 w-7 text-gray-400" />
          <span className="absolute -top-1 -right-1 bg-[#007AFF] text-[10px] text-white rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
            2
          </span>
        </div>
        <Menu className="h-7 w-7 text-gray-400" />
      </div>
    </>
  );
};

export default Navbar;
