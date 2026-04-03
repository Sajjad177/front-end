import z from "zod";

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword?: string;
}

export const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  repeatPassword: z.string(),
  agree: z.boolean().refine((val) => val === true, {
    message: "You must agree to terms and conditions",
  }),
});
