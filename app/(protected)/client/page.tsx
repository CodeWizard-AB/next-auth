"use client";

import UserInfo from "@/components/UserInfo";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function Client() {
	const user = useCurrentUser();
	return <UserInfo label="💻 Client Component" user={user} />;
}
