
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePost } from "@/hooks/usepost";
import {
  Calendar,
  FileText,
  Image as ImageIcon,
  Send,
  Video,
  X
} from "lucide-react";
import { useSession } from "next-auth/react";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import userImg from "../../../public/user/img.webp";
import { Switch } from "../ui/switch";

type PreviewImage = { file: File; preview: string; id: string };
const MAX_IMAGES = 5;

const PostBox = () => {
  const { data } = useSession();
  const token = data?.accessToken;
  const [isPublic, setIsPublic] = useState(true);
  const [selectedImages, setSelectedImages] = useState<PreviewImage[]>([]);
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const postMutation = usePost(); 

  const processFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const remainingSlots = MAX_IMAGES - selectedImages.length;

    if (remainingSlots <= 0) {
      toast.error(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const limitedFiles = imageFiles.slice(0, remainingSlots);
    const newImages: PreviewImage[] = limitedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7),
    }));

    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    processFiles(Array.from(e.target.files));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    processFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = (idToRemove: string) => {
    setSelectedImages((prev) => {
      const filtered = prev.filter((img) => img.id !== idToRemove);
      const removedImg = prev.find((img) => img.id === idToRemove);
      if (removedImg) URL.revokeObjectURL(removedImg.preview);
      return filtered;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePost = async () => {
    if (!text.trim() && selectedImages.length === 0) {
      toast.error("Empty post is not allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    formData.append("visibility", isPublic ? "public" : "private");
    selectedImages.forEach((img) => formData.append("images", img.file));

    postMutation.mutate(
      { formData, token },
      {
        onSuccess: () => {
          toast.success("Post created successfully!");
          setText("");
          setSelectedImages([]);
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to create post.");
        },
      },
    );
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="bg-white rounded-2xl border border-slate-200/60 p-4 w-full"
    >
      <div className="flex items-start gap-3 mb-4">
        <Avatar className="h-10 w-10 border shrink-0">
          <AvatarImage src={userImg.src} />
          <AvatarFallback>DF</AvatarFallback>
        </Avatar>

        <div className="flex-1 mt-1">
          <div className="flex items-start">
            <textarea
              placeholder="What's on your mind?..."
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              rows={Math.max(1, text.split("\n").length)}
              className="w-full bg-transparent py-1 text-[16px] text-slate-700 focus:outline-none placeholder:text-slate-400 resize-none overflow-y-auto min-h-[40px] max-h-[260px] leading-relaxed"
            />
          </div>

          {selectedImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedImages.map((image) => (
                <div key={image.id} className="relative inline-block group">
                  <img
                    src={image.preview}
                    alt="Preview"
                    className="h-24 w-24 rounded-lg object-cover border border-gray-200"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute -top-1.5 -right-1.5 bg-slate-800 text-white p-0.5 rounded-full hover:bg-red-500 transition-colors cursor-pointer border-2 border-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#f3f9ff] rounded-lg p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center sm:gap-4">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200/50 rounded-md transition-colors cursor-pointer"
          >
            <ImageIcon className="w-5 h-5 text-gray-500" />
            <span className="lg:flex hidden text-[13px] font-medium text-gray-600">
              Photo
            </span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200/50 rounded-md transition-colors cursor-pointer">
            <Video className="w-5 h-5 text-gray-500" />
            <span className="lg:flex hidden text-[13px] font-medium text-gray-600">
              Video
            </span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200/50 rounded-md transition-colors cursor-pointer">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="lg:flex hidden text-[13px] font-medium text-gray-600">
              Event
            </span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200/50 rounded-md transition-colors cursor-pointer">
            <FileText className="w-5 h-5 text-gray-500" />
            <span className="lg:flex hidden text-[13px] font-medium text-gray-600">
              Article
            </span>
          </button>

          <div className="flex items-center gap-2 pl-4">
            <span className="lg:flex hidden text-[13px] font-medium text-gray-600">
              {isPublic ? "Public" : "Private"}
            </span>
            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
              className="data-[state=checked]:bg-blue-600 cursor-pointer data-[state=unchecked]:bg-gray-200"
            />
          </div>
        </div>

        <button
          onClick={handlePost}
          disabled={!text.trim() && selectedImages.length === 0}
          className="bg-blue-500 text-white px-6 py-2 rounded-sm flex items-center gap-2 font-semibold text-[14px] hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Post</span>
        </button>
      </div>
    </div>
  );
};

export default PostBox;
