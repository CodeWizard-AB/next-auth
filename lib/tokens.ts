import User from "@/models/userModel";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export const generateVerficationToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date(Date.now() + 3600 * 1000);
	await User.updateOne(
		{ email },
		{ verificationToken: token, verificationExpires: expires }
	);
	return token;
};

export const generateResetToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date(Date.now() + 3600 * 1000);
	await User.updateOne(
		{ email },
		{ passwordResetToken: token, passwordResetExpires: expires }
	);
	return token;
};

export const generateTwoFactorToken = async (email: string) => {
	const token = crypto.randomInt(100_000, 1_000_000).toString();
	const expires = new Date(Date.now() + 3600 * 1000);
	await User.updateOne(
		{ email },
		{ twoFactorToken: token, twoFactorExpires: expires }
	);
	return token;
};
