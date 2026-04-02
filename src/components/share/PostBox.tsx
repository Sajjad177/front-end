import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  FileText,
  Image as ImageIcon,
  Pencil,
  Send,
  Video,
} from "lucide-react";

import userImg from "../../../public/user/img.webp";

const PostBox = () => {
  return (
    <div className="bg-white rounded-md p-4 w-full">
      {/* Input Area */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={userImg.src} />
          <AvatarFallback>DF</AvatarFallback>
        </Avatar>
        <div className="flex-1 relative group">
          <input
            type="text"
            placeholder="Write something ..."
            className="w-full bg-transparent py-2 pr-10 text-[15px] focus:outline-none placeholder:text-gray-400"
          />
          <button className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <Pencil className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="bg-[#F8FAFC] rounded-lg p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto no-scrollbar">
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200/50 rounded-md transition-colors whitespace-nowrap">
            <ImageIcon className="w-5 h-5 text-gray-500" />
            <span className="text-[13px] font-medium text-gray-600">Photo</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200/50 rounded-md transition-colors whitespace-nowrap">
            <Video className="w-5 h-5 text-gray-500" />
            <span className="text-[13px] font-medium text-gray-600">Video</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200/50 rounded-md transition-colors whitespace-nowrap">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-[13px] font-medium text-gray-600">Event</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200/50 rounded-md transition-colors whitespace-nowrap">
            <FileText className="w-5 h-5 text-gray-500" />
            <span className="text-[13px] font-medium text-gray-600">
              Article
            </span>
          </button>
        </div>

        {/* Post Button */}
        <button className="bg-[#007AFF] text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold text-sm hover:bg-blue-600 transition-all shadow-md shadow-blue-100 ml-auto">
          <Send className="w-4 h-4 rotate-[-45deg] mb-1" />
          Post
        </button>
      </div>
    </div>
  );
};

export default PostBox;
