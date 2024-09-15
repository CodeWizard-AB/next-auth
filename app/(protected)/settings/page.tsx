import { auth } from "@/actions/auth";

export default async function Settings() {
	const session = await auth();
	return <div>Settings</div>;
}
