import { getCurrentUser } from "@/actions/users";
import UserInfo from "@/components/UserInfo";

export default async function Server() {
	const user = await getCurrentUser();
	return <UserInfo label="💻 Server Component" user={user} />;
}
