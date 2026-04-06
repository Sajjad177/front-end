import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import events from "@/data/event.json";
import {
  BarChart2,
  Bookmark,
  Gamepad2,
  PlayCircle,
  Save,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import Image from "next/image";

const SidebarLeft = () => {
  const exploreItems = [
    {
      icon: <PlayCircle className="w-5 h-5" />,
      label: "Learning",
      isNew: true,
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      label: "Insights",
      isNew: false,
    },
    {
      icon: <UserPlus className="w-5 h-5" />,
      label: "Find friends",
      isNew: false,
    },
    {
      icon: <Bookmark className="w-5 h-5" />,
      label: "Bookmarks",
      isNew: false,
    },
    { icon: <Users className="w-5 h-5" />, label: "Group", isNew: false },
    { icon: <Gamepad2 className="w-5 h-5" />, label: "Gaming", isNew: true },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", isNew: false },
    { icon: <Save className="w-5 h-5" />, label: "Save post", isNew: false },
  ];

  const suggestedPeople = [
    {
      name: "Steve Jobs",
      role: "CEO of Apple",
      img: "https://github.com/shadcn.png",
    },
    {
      name: "Ryan Roslansky",
      role: "CEO of Linkedin",
      img: "https://github.com/shadcn.png",
    },
    {
      name: "Dylan Field",
      role: "CEO of Figma",
      img: "https://github.com/shadcn.png",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-md p-4">
        <h3 className="font-bold text-lg px-2 mb-4 text-gray-800">Explore</h3>
        <div className="space-y-1">
          {exploreItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-between hover:bg-gray-50 text-gray-600 font-medium py-6 px-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-400">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.isNew && (
                <Badge className="bg-[#00D084] hover:bg-[#00D084] text-white border-none rounded-md text-[10px] px-1.5 py-0.5">
                  New
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-md p-4">
        <div className="flex justify-between items-center px-2 mb-6">
          <h3 className="font-bold text-lg text-gray-800">Suggested People</h3>
          <button className="text-[#007AFF] text-xs font-semibold hover:underline">
            See All
          </button>
        </div>
        <div className="space-y-5">
          {suggestedPeople.map((person, index) => (
            <div key={index} className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={person.img} />
                  <AvatarFallback>{person.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">
                    {person.name}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {person.role}
                  </span>
                </div>
              </div>
              <Button className="text-gray-400 border-gray-200 text-xs h-8 px-3 hover:bg-[#007AFF] hover:text-white transition-all bg-white rounded-none cursor-pointer">
                Connect
              </Button>
            </div>
          ))}
        </div>
      </div>



      <div className="bg-white rounded-md p-4">
        <div className="flex justify-between items-center mb-6 px-1">
          <h3 className="font-extrabold text-xl text-gray-900 tracking-tight">
            Events
          </h3>
          <button className="text-[#007AFF] text-sm font-bold hover:underline transition-all">
            See all
          </button>
        </div>
        <div className="space-y-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="group cursor-pointer shadow-sm p-4 rounded-md hover:bg-gray-50 transition-all"
            >

              <div className="relative w-full h-[180px] rounded-2xl overflow-hidden mb-4 ">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>


              <div className="flex gap-4 items-start mb-4">
                <div className="bg-[#00D084] text-white min-w-[55px] h-[65px] rounded-md flex flex-col items-center justify-center shadow-lg shadow-green-100">
                  <span className="text-xl font-black leading-none">
                    {event.date.split(" ")[0]}
                  </span>
                  <span className="text-[11px] font-bold uppercase mt-1">
                    {event.date.split(" ")[1]}
                  </span>
                </div>


                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-[16px]">
                    {event.description}
                  </h4>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                <span className="text-gray-400 text-sm font-medium">
                  {event.peopleGoing} People Going
                </span>
                <button className="border border-[#007AFF] text-[#007AFF] px-6 py-1.5  text-sm font-bold hover:bg-[#007AFF] hover:text-white transition-all active:scale-95">
                  {event.status}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;
