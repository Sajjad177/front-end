import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import stories from "@/data/stories.json";
import { ChevronRight, Plus } from "lucide-react";
import Image from "next/image";

const StoryAdd = () => {
  return (
    <div className="relative group w-full px-1">
      <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 items-center">

        <div className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group/your">
          <div className="relative w-16 h-16 sm:w-[120px] lg:w-[130px] sm:h-[180px] rounded-full sm:rounded-xl overflow-hidden border-2 border-[#007AFF] sm:border-none bg-[#0F172A]">
            <Image
              src="/images/story-1.jpeg"
              alt="Your Story"
              fill
              className="object-cover brightness-75 sm:brightness-90 group-hover/your:scale-105 transition-transform duration-300"
            />

            <div className="hidden sm:flex absolute inset-0 flex-col justify-end">
              <div className="bg-[#0F172A] h-[35%] w-full relative flex flex-col items-center justify-center rounded-t-[20px]">
                <div className="absolute -top-4 bg-[#007AFF] p-1 rounded-full border-[3px] border-[#0F172A]">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-[10px] lg:text-[11px] font-bold mt-2">
                  Your Story
                </span>
              </div>
            </div>

            <div className="sm:hidden absolute inset-0 flex items-center justify-center">
              <div className="bg-[#007AFF] rounded-full p-0.5 border-2 border-white">
                <Plus className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <span className="text-[10px] font-medium text-[#007AFF] sm:hidden">
            Your Story
          </span>
        </div>

        {stories.map((story) => (
          <div
            key={story.id}
            className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group/card"
          >
            <div className="relative w-16 h-16 sm:w-[120px] lg:w-[130px] sm:h-[180px] rounded-full sm:rounded-xl overflow-hidden border-2 border-[#007AFF] sm:border-none shadow-sm">
              <Image
                src={story.img}
                alt={story.name}
                fill
                className="object-cover group-hover/card:scale-105 transition-transform duration-300"
              />

              <div className="hidden sm:block">
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
                <div className="absolute top-2 right-2 lg:top-3 lg:right-3 border-2 border-white rounded-full overflow-hidden w-7 h-7 lg:w-8 lg:h-8">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={story.userImg} />
                    <AvatarFallback>RR</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute bottom-3 left-0 right-0 text-center px-2">
                  <span className="text-white text-[10px] lg:text-[11px] font-bold line-clamp-1">
                    {story.name}
                  </span>
                </div>
              </div>
            </div>
            <span className="text-[10px] font-medium text-gray-600 sm:hidden w-16 truncate text-center">
              {story.name.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>

      <button className="lg:group-hover:flex absolute right-[-12px] top-1/2 -translate-y-1/2 bg-[#007AFF] text-white p-1.5 rounded-full shadow-xl z-20 transition-all hover:bg-blue-600">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default StoryAdd;
