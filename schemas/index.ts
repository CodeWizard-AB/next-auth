import { z } from "zod";

export const NewPasswordSchema = z.object({
	password: z
		.string()
		.min(8, { message: "Be at least 8 characters long" })
		.regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
		.regex(/[0-9]/, { message: "Contain at least one number." })
		.regex(/[^a-zA-Z0-9]/, {
			message: "Contain at least one special character.",
		})
		.trim(),
});

export const ResetSchema = z.object({
	email: z
		.string({ required_error: "Email is required" })
		.min(1, { message: "Email is required" })
		.email(),
});

export const LoginSchema = z.object({
	email: z
		.string({ required_error: "Email is required" })
		.min(1, { message: "Email is required" })
		.email(),
	password: z
		.string({ required_error: "Password is required" })
		.min(1, { message: "Password is required" }),
	code: z.optional(z.string()),
});

export const SignupSchema = z.object({
	name: z
		.string({ required_error: "Name is required" })
		.min(2, { message: "Name must be at least 2 characters long." })
		.trim(),
	email: z.string().email({ message: "Please enter a valid email." }).trim(),
	password: z
		.string()
		.min(8, { message: "Be at least 8 characters long" })
		.regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
		.regex(/[0-9]/, { message: "Contain at least one number." })
		.regex(/[^a-zA-Z0-9]/, {
			message: "Contain at least one special character.",
		})
		.trim(),
});
