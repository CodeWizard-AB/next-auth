import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dbConnection from "@/config/db";

const font = Inter({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Next Auth",
	description: "Authentication with next-auth",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	await dbConnection();

	return (
		<html lang="en">
			<body className={`h-screen ${font.className}`}>{children}</body>
		</html>
	);
}
