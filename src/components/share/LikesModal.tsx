
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbsUp } from "lucide-react";

type LikesModalProps = {
  show: boolean;
  onClose: () => void;
  loading: boolean;
  likesList: any[];
};

const LikesModal = ({ show, onClose, loading, likesList }: LikesModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 animate-modal-fade">
      <div className="w-full max-w-md bg-white rounded-lg p-4 animate-modal-scale flex flex-col max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex gap-1">
            <ThumbsUp className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">{likesList.length}</span>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 cursor-pointer hover:text-gray-800"
          >
            Close
          </button>
        </div>

        {loading ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : !Array.isArray(likesList) || likesList.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No likes yet</div>
        ) : (
          <ul className="space-y-2 max-h-80 overflow-auto">
            {likesList.map((like: any) => {
              const u = like.userId;
              if (!u) return null;

              return (
                <li key={like._id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={u?.avatar || u?.image} />
                    <AvatarFallback>
                      {(u?.firstName || u?.name || "?")?.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">
                      {u?.firstName || u?.name
                        ? `${(u.firstName || "").charAt(0).toUpperCase() + (u.firstName || "").slice(1)} ${(u.lastName || "").charAt(0).toUpperCase() + (u.lastName || "").slice(1)}`.trim()
                        : u?.username || "Unknown"}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LikesModal;
