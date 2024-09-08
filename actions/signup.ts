"use server";

import { SignupSchema } from "@/schemas";
import { z } from "zod";

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
