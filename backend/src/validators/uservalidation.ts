import { email, parseAsync, z } from "zod";

export const signupSchema = z.object({
    email: z.email("Invalid Email address !"),
    password: z.string().min(8, "Minimum 8 characters required !"),
    name: z.string().min(1, "Name is required !")
});

export const signinSchema = z.object({
    email: z.email("Invalid Email address"),
    password: z.string().min(1, "Minimum 8 characters required !")
});