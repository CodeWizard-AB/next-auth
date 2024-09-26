import CardWrapper from "./CardWrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function ErrorCard() {
	return (
		<CardWrapper
			headerLabel="Oops! Something went wrong!"
			backButtonLabel="Back to login"
			backButtonHref="/auth/login"
		>
			<div className="w-full flex justify-center items-center">
				<ExclamationTriangleIcon className="text-destructive w-6 h-6" />
			</div>
		</CardWrapper>
	);
}
