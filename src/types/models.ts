export interface Author {
  _id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  image?: string;
  name?: string;
  username?: string;
}

export interface Reply {
  _id: string;
  text: string;
  authorId?: Author;
  commentId?: string;
  postId?: string;
  liked?: boolean;
  replyCommentTotalLikes?: number;
  createdAt?: string;
}

export interface Comment {
  _id: string;
  text: string;
  authorId?: Author;
  postId?: string;
  liked?: boolean;
  commentTotalLikes?: number;
  replies?: Reply[];
  createdAt?: string;
}

export interface Post {
  _id: string;
  text?: string;
  images?: any[];
  authorId?: Author;
  liked?: boolean;
  totalLikes?: number;
  totalComments?: number;
  comments?: Comment[];
  __pending?: boolean;
  createdAt?: string;
  postTime?: string;
  visibility?: string;
}

export interface InfinitePageData<T> {
  data: T[];
  meta?: any;
}

export interface InfiniteQueryData<T> {
  pages: InfinitePageData<T>[];
  pageParams?: any[];
}
