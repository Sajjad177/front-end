/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createComment = async (data: any, token: string) => {
  try {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };
    const body = isForm ? data : JSON.stringify(data);
    if (!isForm) headers["Content-Type"] = "application/json";

    const res = await fetch(`${API_URL}/comment/add`, {
      method: "POST",
      headers,
      body,
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Comment creation failed");
    }

    return result;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const getCommentByPostId = async (
  postId: string,
  pageParam?: string,
) => {
  try {
    const res = await fetch(
      `${API_URL}/comment/${postId}?cursor=${pageParam || ""}`,
      {
        method: "GET",
      },
    );

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to fetch comments");

    return result;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const addReplyToComment = async (data: any, token: string) => {
  try {
    const res = await fetch(`${API_URL}/replyComment/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Reply creation failed");
    }

    return result;
  } catch (error) {
    console.error("Error adding reply to comment:", error);
    throw error;
  }
};
