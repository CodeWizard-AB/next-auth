import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function Settings() {
	return (
		<Card className="w-[600px]">
			<CardHeader>
				<p className="text-2xl font-semibold text-center">⚙ Settings</p>
			</CardHeader>
			<CardContent>
				<Button>Update name</Button>
			</CardContent>
		</Card>
	);
}
