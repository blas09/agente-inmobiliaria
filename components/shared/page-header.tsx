import Link from "next/link";
import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";

interface PageHeaderProps {
	title: string;
	description?: string;
	actionHref?: string;
	actionLabel?: string;
	children?: ReactNode;
}

export function PageHeader({
	title,
	description,
	actionHref,
	actionLabel,
	children,
}: PageHeaderProps) {
	return (
		<div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
			<div className="space-y-1">
				<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
				{description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
			</div>
			<div className="flex items-center gap-3">
				{children}
				{actionHref && actionLabel ? (
					<Link className={buttonVariants()} href={actionHref}>
						{actionLabel}
					</Link>
				) : null}
			</div>
		</div>
	);
}
