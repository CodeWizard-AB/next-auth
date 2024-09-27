"use client";

import { logout } from "@/actions/users";

export default function LogoutButton({
	children,
}: {
	children: Readonly<React.ReactNode>;
}) {
	return (
		<span onClick={() => logout()} className="cursor-pointer">
			{children}
		</span>
	);
}
