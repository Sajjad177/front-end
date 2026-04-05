import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const toggleLikesForPost = async (postId: string, token: string) => {
  try {
    const res = await fetch(`${API_URL}/like/toggle/${postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Failed to toggle like");
    }
    return result;
  } catch (error) {
    console.error("Like error:", error);
    throw error;
  }
};

export const getAllLikesForPost = async (postId: string) => {
  try {
    const res = await fetch(`${API_URL}/like/${postId}`, {
      method: "GET",
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Failed to get likes");
    }
    return result;
  } catch (error) {
    console.error("Like error:", error);
    throw error;
  }
};

export const toggleLikesForComment = async (
  commentId: string,
  postId: string,
  token: string,
) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/like/comment-toggle/${commentId}`,
      { postId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return data;
  } catch (error: any) {
    console.error("API ERROR:", error.response?.data);
    throw error;
  }
};

export const toggleLikesForCommentReply = async (
  replyId: string,
  token: string,
  postId: string,
) => {
  const res = await axios.post(
    `${API_URL}/like/reply-comment-toggle/${replyId}`,
    { postId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};



export const getLikesByCommentId = async (commentId: string) => {
  try {
    const res = await fetch(`${API_URL}/like/comment/${commentId}`, {
      method: "GET",
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Failed to get likes");
    }
    return result;
  } catch (error) {
    console.error("Like error:", error);
    throw error;
  }
};



export const getLikesByCommentReplyId = async (replyId: string) => {
  try {
    const res = await fetch(`${API_URL}/like/reply-comment/${replyId}`, {
      method: "GET",
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Failed to get likes");
    }
    return result;
  } catch (error) {
    console.error("Like error:", error);
    throw error;
  }
};