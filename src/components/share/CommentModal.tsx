"use client";

type CommentModalProps = {
  show: boolean;
  onClose: () => void;
  postId: string | null;
};

const CommentModal = ({ show, onClose, postId }: CommentModalProps) => {
  if (!show || !postId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">Comments</h3>
          <button
            onClick={onClose}
            className="text-gray-500 cursor-pointer hover:text-gray-800"
          >
            Close
          </button>
        </div>

        <div className="max-h-80 overflow-auto">
          <p className="text-gray-500">Comments for post: {postId}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
