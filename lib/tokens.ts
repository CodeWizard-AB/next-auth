import User from "@/models/userModel";
import { v4 as uuidv4 } from "uuid";

export const generateVerficationToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date(new Date().getTime() + 3600 * 1000);
	await User.updateOne(
		{ email },
		{ verificationToken: token, verificationTokenExpires: expires }
	);
	return token;
};

export const generateResetToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date(new Date().getTime() + 3600 * 1000);
	await User.updateOne(
		{ email },
		{ passwordResetToken: token, passwordResetExpires: expires }
	);
	return token;
};
