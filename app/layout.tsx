import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const font = Inter({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Next Auth",
	description: "Authentication with next-auth",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`h-screen ${font.className}`}>{children}</body>
		</html>
	);
}
