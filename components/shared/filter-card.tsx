import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function FilterCard({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<Card className={cn("w-full max-w-3xl p-4", className)}>
			<CardContent>{children}</CardContent>
		</Card>
	);
}
