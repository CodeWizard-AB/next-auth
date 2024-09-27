"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import UserButton from "@/components/auth/UserButton";

const navlinks = [
	{ label: "Server", href: "/server" },
	{ label: "Client", href: "/client" },
	{ label: "Admin", href: "/admin" },
	{ label: "Settings", href: "/settings" },
];

export default function NavBar() {
	const pathname = usePathname();

	return (
		<nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
			<div className="flex gap-x-2">
				{navlinks.map(({ label, href }) => (
					<Button
						asChild
						key={label} 
						variant={pathname === href ? "default" : "outline"}
					>
						<Link href={href}>{label}</Link>
					</Button>
				))}
			</div>
			<UserButton />
		</nav>
	);
}
