"use client";

import { useSearchParams } from "next/navigation";
import CardWrapper from "./CardWrapper";
import { BeatLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/users";
import FormError from "../FormError";
import FormSuccess from "../FormSuccess";

export default function VerificationForm() {
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();

	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const onSubmit = useCallback(() => {
		if (!token) {
			return setError("Missing token");
		}

		newVerification(token)
			.then((data) => {
				setSuccess(data.success);
				setError(data.error);
			})
			.catch(() => {
				setError("Something went wrong");
			});
	}, [token ]);

	useEffect(() => {
		onSubmit();
	}, [onSubmit]);

	return (
		<CardWrapper
			headerLabel="Confirming your verification"
			backButtonHref="/auth/login"
			backButtonLabel="Back to login"
		>
			<div className="flex justify-center items-center w-full">
				{!success && !error && <BeatLoader />}
				<FormError message={error} />
				<FormSuccess message={success} />
			</div>
		</CardWrapper>
	);
}
