const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createPost = async (formData: FormData, token: string) => {
  try {
    const res = await fetch(`${API_URL}/post/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Post creation failed");
    }

    return result;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const getAllPost = async ({ pageParam }: { pageParam?: string }) => {
  try {
    const res = await fetch(`${API_URL}/post?cursor=${pageParam || ""}`, {
      method: "GET",
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to fetch posts");

    return result;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
