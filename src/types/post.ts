export interface Post {
  text: string;
  images: File[];
  visibility: "public" | "private";
}
