"use server";

import { z } from "zod";
import { LoginSchema, SignupSchema } from "@/schemas";
import { signIn } from "@/actions/auth";
import User from "@/models/userModel";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerficationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

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
