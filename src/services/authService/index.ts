import { RegisterInput } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (data: RegisterInput) => {
  try {
    const res = await fetch(`${API_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Registration failed");
    }

    return result;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};