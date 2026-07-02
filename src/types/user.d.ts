export type UserRole = "ADMIN" | "USER" | "MANAGER";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  bio?: string;
  phoneNumber?: string;
  company?: string;
}
