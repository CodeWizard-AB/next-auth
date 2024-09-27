"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import CardWrapper from "@/components/auth/CardWrapper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NewPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import { passwordReset } from "@/actions/users";
import { useState, useTransition } from "react";
import { ClipLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

export default function ResetForm() {
	const searchParams = useSearchParams();
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof NewPasswordSchema>>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: { password: "" },
	});

	const onSubmit = (data: z.infer<typeof NewPasswordSchema>) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			passwordReset(data, searchParams.get("token")).then((data) => {
				setError(data?.error);
				setSuccess(data?.success);
			});
		});
	};

	return (
		<CardWrapper
			headerLabel="Enter a new password"
			backButtonLabel="Back to login"
			backButtonHref="/auth/login"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>New password</FormLabel>
								<FormControl>
									<Input
										disabled={isPending}
										type="password"
										placeholder="john.doe@example.com"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormError message={error} />
					<FormSuccess message={success} />
					<Button type="submit" disabled={isPending} className="w-full">
						{isPending ? (
							<ClipLoader color="white" size={20} />
						) : (
							"Reset password"
						)}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
}
