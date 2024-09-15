import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import User from "@/models/userModel";
import { LoginSchema } from "@/schemas";

export const {
	handlers: { GET, POST },
	signIn,
	signOut,
	auth,
} = NextAuth({
	session: { strategy: "jwt" },
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_ID as string,
			clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
		Credentials({
			async authorize(credentials) {
				if (credentials === null) return null;

				const validatedFields = LoginSchema.safeParse(credentials);

				if (validatedFields.success) {
					const { email, password } = validatedFields.data;
					const user = await User.findOne({ email });

					if (!user || !user.password) return null;

					if (user && (await user.isPasswordCorrect(password))) {
						return user;
					} else {
						return { error: "User not registered with this email" };
					}
				}
			},
		}),
	],
});
