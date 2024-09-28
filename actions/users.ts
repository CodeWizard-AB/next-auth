"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import {
	LoginSchema,
	NewPasswordSchema,
	ResetSchema,
	SettingSchema,
	SignupSchema,
} from "@/schemas";
import { auth, signIn, signOut } from "@/actions/auth";
import User from "@/models/userModel";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import {
	generateResetToken,
	generateTwoFactorToken,
	generateVerficationToken,
} from "@/lib/tokens";
import {
	sendResetEmail,
	sendTwoFactorEmail,
	sendVerificationEmail,
} from "@/lib/mail";

export const getCurrentUser = async () => {
	const session = await auth();
	return session?.user;
};

export const logout = async () => {
	await signOut();
};

export const login = async (data: z.infer<typeof LoginSchema>) => {
	const validatedFields = LoginSchema.safeParse(data);

	if (!validatedFields.success) {
		return { error: "Invalid fields" };
	}

	const { email, code, password } = validatedFields.data;
	const user = await User.findOne({ email }).select("+password");

	if (!user) return { error: "User has not registered!" };
	if (!(await bcrypt.compare(password, user.password))) {
		return { error: "Invalid credentials" };
	}

	if (!user.emailVerified) {
		const token = await generateVerficationToken(user.email);
		await sendVerificationEmail(user.email, token);
		return { success: "Confirmation email sent!" };
	}

	if (!user.twoFactorVerified) {
		if (!code) {
			const token = await generateTwoFactorToken(user.email);
			await sendTwoFactorEmail(user.email, token);
			return { twoFactor: true };
		} else {
			if (user.twoFactorToken !== code || !user.twoFactorToken) {
				return { error: "Invalid code!" };
			}
			const hasExpired = new Date(user.twoFactorExpires) < new Date();
			if (hasExpired) {
				return { error: "Code expired" };
			}
			await User.updateOne({ email }, { twoFactorVerified: true });
		}
	}

	try {
		if (user.authProvider === "credentials") {
			await signIn("credentials", {
				...validatedFields.data,
				redirectTo: DEFAULT_LOGIN_REDIRECT,
			});
		} else return { error: "Email already in use with different provider!" };
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

	const hasExpired = new Date(user?.verificationExpires) < new Date();

	if (hasExpired) {
		return { error: "Token has expired!" };
	}

	user.emailVerified = true;
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
	user.passwordChangedAt = new Date();
	user.save();

	return { success: "Password updated!" };
};

export const settings = async (data: z.infer<typeof SettingSchema>) => {
	const user = await getCurrentUser();
	const existingUser = await User.findById(user?.id).select("+password");

	if (!user || !existingUser) {
		return { error: "Unauthorized" };
	}

	const { password, newPassword, email, name } = data;

	if (email && email !== existingUser.user) {
		const findUser = await User.findOne({ email });

		if (findUser && existingUser.id !== user.id) {
			return { error: "Email already in use" };
		}

		const token = await generateVerficationToken(email);
		await sendVerificationEmail(email, token);

		return { success: "Verification email sent!" };
	}

	existingUser.name = name;

	if (password && newPassword && existingUser.password) {
		if (await bcrypt.compare(password, existingUser.password)) {
			existingUser.password = newPassword;
			existingUser.passwordChangedAt = new Date();
		} else {
			return { error: "Incorrect password!" };
		}
	}

	existingUser.save();
	return { success: "Settings updated!" };
};
