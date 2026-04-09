import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EmptyStateProps {
	title: string;
	description: string;
	footer?: ReactNode;
}

export function EmptyState({ title, description, footer }: EmptyStateProps) {
	return (
		<Card className="border-dashed">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			{footer ? <CardContent>{footer}</CardContent> : null}
		</Card>
	);
}

