"use server";

import { LoginSchema } from "@/schemas";
import { z } from "zod";

export const login = async (data: z.infer<typeof LoginSchema>) => {
	const validatedFields = LoginSchema.safeParse(data);

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
