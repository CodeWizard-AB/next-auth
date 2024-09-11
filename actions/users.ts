"use server";

import { z } from "zod";
import { LoginSchema, SignupSchema } from "@/schemas";
import { signIn } from "@/actions/auth";

export const login = async (data: z.infer<typeof LoginSchema>) => {
	const validatedFields = LoginSchema.safeParse(data);

	await new Promise((resolve) => {
		setTimeout(() => {
			resolve(data);
		}, 2000);
	});

	if (!validatedFields.success) {
		return { error: "Invalid fields" };
	}

	await signIn("credentials", { ...validatedFields.data, redirect: false });

	return { success: "Email sent" };
};

export const signup = async (data: z.infer<typeof SignupSchema>) => {
	const validatedFields = SignupSchema.safeParse(data);

	await new Promise((resolve) => {
		setTimeout(() => {
			resolve(data);
			console.log(data);
		}, 2000);
	});

	if (!validatedFields.success) {
		return { error: "Invalid fields" };
	}

	return { success: "Email sent" };
};

export const socialLogin = async (formdata: FormData) => {
	const social = formdata.get("social");
	await signIn(social as string, { redirectTo: "/" });
};

export const logout = async () => {};
