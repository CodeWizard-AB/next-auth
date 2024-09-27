import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import User from "@/models/userModel";
import { LoginSchema } from "@/schemas";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			role: "user" | "admin";
		} & DefaultSession["user"];
	}
}

export const {
	handlers: { GET, POST },
	signIn,
	signOut,
	auth,
} = NextAuth({
	pages: {
		signIn: "/auth/login",
		error: "/auth/error",
	},
	session: { strategy: "jwt" },
	callbacks: {
		async session({ token, session }) {
			try {
				const user = await User.findById(token?.sub);
				if (user) {
					session.user = {
						...session.user,
						id: user.id,
						role: user.role as "admin" | "user",
					};
				}
			} catch (error) {
				console.error("Data fetching problem");
			}

			return session;
		},
		async signIn({ user, account }) {
			const existingUser = await User.findOne({ email: user.email });

			if (!existingUser) {
				const newUser = new User({
					name: user?.name,
					email: user?.email,
					image: user?.image,
					authProvider: account?.provider,
				});

				await newUser.save();
			} else {
				existingUser.name = user.name || existingUser.name;
				existingUser.image = user.image || existingUser.image;
				existingUser.authProvider =
					account?.provider || existingUser.authProvider;
				await existingUser.save();
			}

			const findUser = await User.findById(user.id);

			if (!findUser?.emailVerified) return false;
			if (!findUser?.twoFactorVerified) return false;

			findUser.verificationToken = undefined;
			findUser.verificationExpires = undefined;
			findUser.twoFactorToken = undefined;
			findUser.twoFactorExpires = undefined;
			findUser.passwordResetToken = undefined;
			findUser.passwordResetExpires = undefined;
			findUser.save();

			return true;
		},
	},
	providers: [
		Github({
			clientId: process.env.AUTH_GITHUB_ID as string,
			clientSecret: process.env.AUTH_GITHUB_SECRET as string,
		}),
		Google({
			clientId: process.env.AUTH_GOOGLE_ID as string,
			clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
		}),
		Credentials({
			async authorize(credentials) {
				const validatedFields = LoginSchema.safeParse(credentials);

				if (validatedFields.success) {
					const { email, password } = validatedFields.data;
					const user = await User.findOne({ email }).select("+password");

					if (!user || !user.password) return null;

					if (await user.isPasswordCorrect(password)) return user;
				}

				return null;
			},
		}),
	],
});
