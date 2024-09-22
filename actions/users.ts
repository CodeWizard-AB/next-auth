"use server";

import { z } from "zod";
import { LoginSchema, SignupSchema } from "@/schemas";
import { signIn } from "@/actions/auth";
import User from "@/models/userModel";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const login = async (data: z.infer<typeof LoginSchema>) => {
	const validatedFields = LoginSchema.safeParse(data);

	if (!validatedFields.success) {
		return { error: "Invalid fields" };
	}

	try {
		await signIn("credentials", {
			...validatedFields.data,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		});

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
		await User.create(validatedFields.data);
	}

	return { success: "Email sent" };
};

export const socialLogin = async (formdata: FormData) => {
	const social = formdata.get("social") as string;
	await signIn(social, { redirectTo: DEFAULT_LOGIN_REDIRECT });
};
