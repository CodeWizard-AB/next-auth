import LoginButton from "@/components/auth/LoginButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import React from "react";

const font = Poppins({ weight: "600", subsets: ["latin"] });

export default function Home() {
	return (
		<main className="grid place-items-center h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
			<div className="space-y-6 text-center">
				<h1
					className={cn(
						"text-6xl font-semibold text-white drop-shadow-md",
						font.className
					)}
				>
					🔐 Auth
				</h1>
				<p className="text-lg text-white">A simple authentication service</p>
				<div>
					<LoginButton asChild={true}>
						<Button variant="secondary" size="lg" className="text-base">
							Sign in
						</Button>
					</LoginButton>
				</div>
			</div>
		</main>
	);
}
