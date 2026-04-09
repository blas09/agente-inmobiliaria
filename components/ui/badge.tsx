import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default: "border-transparent bg-primary text-white",
				primary: "border-transparent bg-primary text-white",
				secondary: "border-transparent bg-secondary text-white",
				success: "border-transparent bg-success text-white",
				warning: "border-transparent bg-warning text-white",
				info: "border-transparent bg-info text-white",
				error: "border-transparent bg-error text-white",
				outline: "border-border bg-background text-foreground/75",
				outlineSecondary: "border-secondary/25 bg-background text-secondaryemphasis",
				outlineSuccess: "border-success/25 bg-background text-successemphasis",
				outlineWarning: "border-warning/25 bg-background text-warningemphasis",
				outlineError: "border-error/25 bg-background text-erroremphasis",
				outlineInfo: "border-info/25 bg-background text-infoemphasis",
				lightPrimary: "border-transparent bg-lightprimary text-primaryemphasis",
				lightSecondary: "border-transparent bg-lightsecondary text-secondaryemphasis",
				lightSuccess: "border-transparent bg-lightsuccess text-successemphasis",
				lightError: "border-transparent bg-lighterror text-erroremphasis",
				lightInfo: "border-transparent bg-lightinfo text-infoemphasis",
				lightWarning: "border-transparent bg-lightwarning text-warningemphasis",
				destructive: "border-transparent bg-destructive text-destructive-foreground",
				gray: "border-border/80 bg-muted/70 text-foreground/70",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
	return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
