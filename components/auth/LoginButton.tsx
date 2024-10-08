"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
	children: Readonly<React.ReactNode>;
	mode?: "modal" | "redirect";
	asChild: boolean;
}

export default function LoginButton({
	children,
	mode = "redirect",
}: LoginButtonProps) {
	const router = useRouter();

	const onClick = () => {
		router.push("/auth/login");
	};

	if (mode === "modal") {
		return <span>Modal</span>;
	}

	return (
		<span className="cursor-pointer" onClick={onClick}>
			{children}
		</span>
	);
}
