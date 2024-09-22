import { auth, signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export default async function Settings() {
	const session = await auth();

	return (
		<div>
			<img src={session?.user?.image} alt={session.user.name} />
			<p>Settings page: </p>
			<p>{JSON.stringify(session?.user)}</p>
			<form
				action={async () => {
					"use server";
					await signOut();
				}}
			>
				<Button>Sign out</Button>
			</form>
		</div>
	);
}
