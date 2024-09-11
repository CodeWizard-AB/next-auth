import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

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
				try {
					let user = null;
					user = credentials;
					console.log(credentials);
					return user;
				} catch (error) {
					if (error instanceof Error) {
						throw new Error(error.message);
					} else {
						throw new Error("An unknown error occurred");
					}
				}
			},
		}),
	],
});
