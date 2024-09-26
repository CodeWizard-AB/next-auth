"use server";

import User from "@/models/userModel";

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
