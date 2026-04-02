import Feed from "@/components/modules/Feed";
import Navbar from "@/components/modules/Navbar";
import SidebarLeft from "@/components/modules/SidebarLeft";
import SidebarRight from "@/components/modules/SidebarRight";

const MainPage = () => {
  return (
    <div className="min-h-screen bg-[#F3F5F7]">
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-4 mt-4 sm:mt-6">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr_320px] gap-6 items-start">
          <aside className="hidden md:block sticky top-24 h-[calc(100vh-110px)] overflow-y-auto no-scrollbar pr-2">
            <SidebarLeft />
          </aside>

          <section className="flex flex-col gap-6 pb-20 min-w-0 w-full">
            <Feed />
          </section>

          <aside className="hidden lg:block sticky top-24 h-[calc(100vh-110px)] overflow-y-auto no-scrollbar pl-2">
            <SidebarRight />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
