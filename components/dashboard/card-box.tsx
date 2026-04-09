import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardBoxProps {
	children: ReactNode;
	className?: string;
}

export function CardBox({ children, className }: CardBoxProps) {
	return (
		<Card className={cn("card border border-border", className)} style={{ borderRadius: "7px" }}>
			{children}
		</Card>
	);
}
