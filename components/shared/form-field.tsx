import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FormFieldProps {
	label: string;
	htmlFor: string;
	error?: string;
	description?: string;
	children: ReactNode;
	className?: string;
}

export function FormField({
	label,
	htmlFor,
	error,
	description,
	children,
	className,
}: FormFieldProps) {
	return (
		<div className={cn("space-y-2.5", className)}>
			<label
				className="text-sm font-medium text-foreground"
				htmlFor={htmlFor}
			>
				{label}
			</label>
			{children}
			{description ? <p className="text-xs leading-5 text-muted-foreground">{description}</p> : null}
			{error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
		</div>
	);
}
