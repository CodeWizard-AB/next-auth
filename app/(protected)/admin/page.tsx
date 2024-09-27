import { getCurrentUser } from "@/actions/users";
import RoleGate from "@/components/auth/RoleGate";
import FormSuccess from "@/components/FormSuccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Admin() {
	return (
		<Card className="w-[600px]">
			<CardHeader>
				<p className="text-2xl font-semibold text-center">🔑 Admin</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<RoleGate allowedRole="admin">
					<FormSuccess message="You are allowed to see this content!" />
				</RoleGate>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
					<p className="text-sm font-medium">Admin-only API Route</p>
					<Button>Click to test</Button>
				</div>
			</CardContent>
		</Card>
	);
}
