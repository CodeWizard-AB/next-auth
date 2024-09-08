import React from "react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function Social() {
	return (
		<div className="flex items-center w-full gap-x-2">
			<Button size="lg" className="w-full " variant="outline">
				<FcGoogle size={25} />
			</Button>
			<Button className="w-full" size="lg" variant="outline">
				<FaGithub size={25} />
			</Button>
		</div>
	);
}
