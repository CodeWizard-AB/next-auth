"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { settings } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SettingSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import { ClipLoader } from "react-spinners";
import { Input } from "@/components/ui/input";
import useCurrentUser from "@/hooks/useCurrentUser";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function Settings() {
	const { update } = useSession();
	const user = useCurrentUser();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();

	useEffect(() => {
		setTimeout(() => {
			setError("");
			setSuccess("");
		}, 5000);
	}, [error, success]);

	const form = useForm<z.infer<typeof SettingSchema>>({
		resolver: zodResolver(SettingSchema),
		defaultValues: {
			name: user?.name || undefined,
			email: user?.email || undefined,
			password: undefined,
			newPassword: undefined,
			role: user?.role || undefined,
		},
	});

	const onSubmit = (data: z.infer<typeof SettingSchema>) => {
		startTransition(() => {
			settings(data)
				.then(({ error, success }) => {
					if (error) setError(error);
					if (success) {
						update();
						setSuccess(success);
					}
				})
				.catch(() => setError("Something went wrong!"));
		});
	};

	return (
		<Card className="w-[600px]">
			<CardHeader>
				<p className="text-2xl font-semibold text-center">⚙ Settings</p>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											defaultValue={user?.name as string}
											disabled={isPending}
											type="text"
											placeholder="John Doe"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{user?.provider === "credentials" && (
							<>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													defaultValue={user?.email as string}
													disabled={isPending}
													type="email"
													placeholder="john@yahoo.com"
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
								<FormField
									control={form.control}
									name="newPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>New Password</FormLabel>
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
							</>
						)}

						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role</FormLabel>
									<FormControl>
										<Select
											disabled={isPending}
											onValueChange={field.onChange}
											defaultValue={user?.role as string}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select role" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="admin">Admin</SelectItem>
												<SelectItem value="user">User</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{!isPending && (
							<>
								<FormError message={error} />
								<FormSuccess message={success} />
							</>
						)}
						<Button disabled={isPending} type="submit">
							{isPending ? <ClipLoader color="white" size={20} /> : "Save"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
