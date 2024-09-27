import { getCurrentUser } from "@/actions/users";
import FormError from "../FormError";

export default async function RoleGate({
	children,
	allowedRole,
}: {
	children: Readonly<React.ReactNode>;
	allowedRole: "admin" | "user";
}) {
	const user = await getCurrentUser();

	if (user?.role !== allowedRole) {
		return (
			<FormError message="You do not have the permission to view this content!" />
		);
	}

	return children;
}
