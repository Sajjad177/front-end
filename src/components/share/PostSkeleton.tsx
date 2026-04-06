import { Skeleton } from "@/components/ui/skeleton";

const PostSkeleton = () => {
  return (
    <div className="bg-white rounded-sm border border-gray-100 w-full overflow-hidden mb-4">
      <div className="flex items-center gap-3 p-4">
        <Skeleton className="h-10 w-10 text-transparent rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <div className="px-4 pb-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[75%]" />
      </div>

      <div className="px-4 pb-3">
        <Skeleton className="w-full aspect-video rounded-xl" />
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );
};

export default PostSkeleton;
