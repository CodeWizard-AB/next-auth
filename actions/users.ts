"use server";

import { z } from "zod";
import {
	LoginSchema,
	NewPasswordSchema,
	ResetSchema,
	SignupSchema,
} from "@/schemas";
import { signIn } from "@/actions/auth";
import User from "@/models/userModel";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateResetToken, generateVerficationToken } from "@/lib/tokens";
import { sendResetEmail, sendVerificationEmail } from "@/lib/mail";

export const login = async (data: z.infer<typeof LoginSchema>) => {
	const validatedFields = LoginSchema.safeParse(data);

	if (!validatedFields.success) {
		return { error: "Invalid fields" };
	}

	const user = await User.findOne({ email: validatedFields.data.email });

	if (!user.isVerified) {
		const token = await generateVerficationToken(validatedFields.data.email);
		await sendVerificationEmail(validatedFields.data.email, token);
		return { success: "Confirmation email sent!" };
	}

	try {
		if (user.authProvider === "credentials") {
			await signIn("credentials", {
				...validatedFields.data,
				redirectTo: DEFAULT_LOGIN_REDIRECT,
			});
		} else return { error: "Email already in use with different provider!" };

		return { success: "Email sent" };
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid credentials!" };
				default:
					return { error: "Something went wrong" };
			}
		}

		throw error;
	}
};

export const signup = async (data: z.infer<typeof SignupSchema>) => {
	const validatedFields = SignupSchema.safeParse(data);

	if (!validatedFields.success) {
		return { error: "Invalid fields" };
	}

	const { email } = validatedFields.data;

	const user = await User.findOne({ email });

	if (user) {
		return { error: "User already exists!" };
	} else {
		await User.create({ ...validatedFields.data, authProvider: "credentials" });
	}

	const token = await generateVerficationToken(email);
	await sendVerificationEmail(email, token);

	return { success: "Confirmation email sent!" };
};

export const socialLogin = async (formdata: FormData) => {
	const social = formdata.get("social") as string;
	await signIn(social, { redirectTo: DEFAULT_LOGIN_REDIRECT });
};

export const newVerification = async (verificationToken: string) => {
	const user = await User.findOne({ verificationToken });

	if (!user) {
		return { error: "User does not exist!" };
	}

	if (!user.verificationToken) {
		return { error: "Token does not exists!" };
	}

	const hasExpired = new Date(user?.verificationTokenExpires) < new Date();

	if (hasExpired) {
		return { error: "Token has expired!" };
	}

	user.isVerified = true;
	user.save();

	return { success: "Email verified!" };
};

export const reset = async (data: z.infer<typeof ResetSchema>) => {
	const validatedFields = ResetSchema.safeParse(data);

	if (!validatedFields.success) {
		return { error: "Invalid email!" };
	}

	const { email } = validatedFields.data;

	const user = await User.findOne({ email });

	if (!user) {
		return { error: "Email not found!" };
	}

	const token = await generateResetToken(email);
	await sendResetEmail(email, token);

	return { success: "Reset email sent!" };
};

export const passwordReset = async (
	data: z.infer<typeof NewPasswordSchema>,
	passwordResetToken?: string | null
) => {
	if (!passwordResetToken) {
		return { error: "Missing token!" };
	}

	const validatedFields = NewPasswordSchema.safeParse(data);

	if (!validatedFields.success) {
		return { error: "Invalid fields!" };
	}

	const user = await User.findOne({ passwordResetToken });

	if (!user) {
		return { error: "User not found!" };
	}

	if (!user.passwordResetToken) {
		return { error: "Invalid token!" };
	}

	const hasExpired = new Date(user.passwordResetExpires) < new Date();

	if (hasExpired) {
		return { error: "Token has expired!" };
	}

	user.password = validatedFields.data.password;
	user.save();

	return { success: "Password updated!" };
};
