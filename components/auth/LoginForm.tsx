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
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "@/components/FormError";
import FormSuccess from "../FormSuccess";
import { login } from "@/actions/users";
import { useState, useTransition } from "react";
import Link from "next/link";
import { ClipLoader } from "react-spinners";

export default function LoginForm() {
	const [twoFactor, setTwoFactor] = useState<boolean>(false);
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: { email: "", password: "", code: "" },
	});

	const onSubmit = (data: z.infer<typeof LoginSchema>) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			login(data)
				.then((data) => {
					if (data?.error) {
						form.reset();
						setError(data?.error);
					}

					if (data?.success) {
						form.reset();
						setSuccess(data?.success);
					}

					if (data?.twoFactor) {
						setTwoFactor(true);
					}
				})
				.catch(() => {
					setError("Something went wrong!");
				});
		});
	};

	return (
		<CardWrapper
			headerLabel="Welcome back"
			backButtonLabel="Don't have an account?"
			backButtonHref="/auth/signup"
			showSocial={!twoFactor}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					{twoFactor ? (
						<FormField
							control={form.control}
							name="code"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Two Factor Code</FormLabel>
									<FormControl>
										<Input
											disabled={isPending}
											type="text"
											placeholder="123456"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					) : (
						<>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												disabled={isPending}
												type="email"
												placeholder="john.doe@example.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												disabled={isPending}
												type="password"
												placeholder="********"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								size="sm"
								variant="link"
								asChild
								className="px-0 font-normal"
							>
								<Link href="/auth/reset">Forgot password</Link>
							</Button>
							<FormError message={error} />
							<FormSuccess message={success} />
						</>
					)}
					<Button type="submit" disabled={isPending} className="w-full">
						{isPending ? (
							<ClipLoader color="white" size={20} />
						) : twoFactor ? (
							"Confirm"
						) : (
							"Login"
						)}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
}
