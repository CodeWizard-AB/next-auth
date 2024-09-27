import React from "react";
import NavBar from "./_components/NavBar";
import { SessionProvider } from "next-auth/react";

export default function ProtectedLayout({
	children,
}: {
	children: Readonly<React.ReactNode>;
}) {
	return (
		<SessionProvider>
			<div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
				<NavBar />
				{children}
			</div>
		</SessionProvider>
	);
}
