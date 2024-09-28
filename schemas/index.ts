import { z } from "zod";

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

export const SettingSchema = z
	.object({
		name: SignupSchema.shape.name.optional(),
		email: SignupSchema.shape.email.optional(),
		password: LoginSchema.shape.password.optional(),
		newPassword: SignupSchema.shape.password.optional(),
		role: z.enum(["user", "admin"]).optional(),
	})
	.refine(
		(data) => {
			if (data.password && !data.newPassword) return false;
			else return true;
		},
		{
			message: "New password is required",
			path: ["newPassword"],
		}
	)
	.refine(
		(data) => {
			if (!data.password && data.newPassword) return false;
			else return true;
		},
		{
			message: "Password is required",
			path: ["password"],
		}
	);

export const NewPasswordSchema = SignupSchema.pick({ password: true });
export const ResetSchema = LoginSchema.pick({ email: true });
