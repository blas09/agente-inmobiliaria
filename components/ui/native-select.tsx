import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const NativeSelect = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
	({ className, children, ...props }, ref) => {
		return (
			<div className="relative">
				<select
					ref={ref}
					className={cn(
						"border-input text-foreground focus-visible:border-primary flex h-9 w-full appearance-none items-center rounded-md border bg-transparent px-3 py-2 pr-10 text-sm shadow-xs outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50",
						className,
					)}
					{...props}
				>
					{children}
				</select>
				<ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
			</div>
		);
	},
);

NativeSelect.displayName = "NativeSelect";

export { NativeSelect };
