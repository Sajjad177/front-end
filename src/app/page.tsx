import Feed from "@/components/modules/Feed";
import Navbar from "@/components/modules/Navbar";
import SidebarLeft from "@/components/modules/SidebarLeft";
import SidebarRight from "@/components/modules/SidebarRight";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const MainPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="h-screen overflow-hidden bg-[#F3F5F7] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 mt-4 sm:mt-6 overflow-hidden min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr_320px] gap-6 h-full">
          <aside className="hidden md:block h-full overflow-y-auto no-scrollbar pr-2 pb-6">
            <SidebarLeft />
          </aside>

          <section className="flex flex-col gap-6 h-full overflow-y-auto no-scrollbar pb-20 md:pb-6 min-w-0 w-full">
            <Feed />
          </section>

          <aside className="hidden lg:block h-full overflow-y-auto no-scrollbar pl-2 pb-6">
            <SidebarRight />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
