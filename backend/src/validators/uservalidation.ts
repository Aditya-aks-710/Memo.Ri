import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required !"),
  email: z.string().email("Invalid Email address !"),
  password: z.string().min(8, "Minimum 8 characters required !"),
  profilePictureUrl: z.string().url("Invalid URL").optional(),
});

export const signinSchema = z.object({
  email: z.string().email("Invalid Email address"),
  password: z.string().min(8, "Minimum 8 characters required !"),
});

// Optional inferred types for controllers
export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
