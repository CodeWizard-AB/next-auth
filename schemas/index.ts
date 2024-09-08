import { z } from "zod";

export const LoginSchema = z.object({
	email: z.string().min(1, { message: "Email is required" }).email(),
	password: z.string().min(1, { message: "Password is required" }),
});

export const SignupSchema = z.object({
	email: z.string().min(1, { message: "Email is required" }).email(),
	password: z.string().min(6, { message: "Minimun 6 characters required" }),
	name: z.string().min(1, { message: "Name is required" }),
});
