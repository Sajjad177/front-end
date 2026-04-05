import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Bookmark,
  FileEdit,
  MoreHorizontal,
  Trash2,
  XSquare,
} from "lucide-react";

export default function PostOptions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-gray-400 hover:bg-gray-50 p-1.5 rounded-full outline-none focus:outline-none transition-colors">
          <MoreHorizontal className="w-5 h-5 cursor-pointer" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[260px] p-4 rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] border-none bg-white -mt-1 mr-2"
      >
        <div className="flex flex-col gap-1.5">
          <DropdownMenuItem className="cursor-pointer flex items-center gap-3 py-2 px-2 hover:bg-gray-50 bg-white rounded-lg group border-none shadow-none focus:bg-gray-50 text-slate-600 focus:text-slate-800">
            <div className="bg-[#ecf3ff] shrink-0 p-2 rounded-full text-[#3b82f6] group-hover:bg-[#e0eeff] transition-colors">
              <Bookmark className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-semibold">Save Post</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer flex items-center gap-3 py-2 px-2 hover:bg-gray-50 bg-white rounded-lg group border-none shadow-none focus:bg-gray-50 text-slate-600 focus:text-slate-800">
            <div className="bg-[#ecf3ff] shrink-0 p-2 rounded-full text-[#3b82f6] group-hover:bg-[#e0eeff] transition-colors">
              <Bell className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-semibold">
              Turn On Notification
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer flex items-center gap-3 py-2 px-2 hover:bg-gray-50 bg-white rounded-lg group border-none shadow-none focus:bg-gray-50 text-slate-600 focus:text-slate-800">
            <div className="bg-[#ecf3ff] shrink-0 p-2 rounded-full text-[#3b82f6] group-hover:bg-[#e0eeff] transition-colors">
              <XSquare className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-semibold">Hide</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer flex items-center gap-3 py-2 px-2 hover:bg-gray-50 bg-white rounded-lg group border-none shadow-none focus:bg-gray-50 text-slate-600 focus:text-slate-800">
            <div className="bg-[#ecf3ff] shrink-0 p-2 rounded-full text-[#3b82f6] group-hover:bg-[#e0eeff] transition-colors">
              <FileEdit className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-semibold">Edit Post</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer flex items-center gap-3 py-2 px-2 hover:bg-gray-50 bg-white rounded-lg group border-none shadow-none focus:bg-gray-50 text-slate-600 focus:text-slate-800">
            <div className="bg-[#ecf3ff] shrink-0 p-2 rounded-full text-[#3b82f6] group-hover:bg-[#e0eeff] transition-colors">
              <Trash2 className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-semibold">Delete Post</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
