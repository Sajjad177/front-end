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
