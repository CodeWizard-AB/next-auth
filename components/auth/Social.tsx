import React from "react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { socialLogin } from "@/actions/users";

export default function Social() {
	return (
		<form className="flex items-center w-full gap-x-2" action={socialLogin}>
			<Button
				size="lg"
				className="w-full "
				variant="outline"
				name="social"
				value="google"
			>
				<FcGoogle size={25} />
			</Button>
			<Button
				className="w-full"
				size="lg"
				variant="outline"
				name="social"
				value="github"
			>
				<FaGithub size={25} />
			</Button>
		</form>
	);
}
