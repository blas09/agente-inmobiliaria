import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:cursor-pointer",
	{
		variants: {
			variant: {
				default: "bg-primary text-white hover:bg-primaryemphasis",
				destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline: "border border-border bg-transparent text-foreground hover:bg-muted",
				outlinesecondary:
					"border border-secondary bg-transparent text-secondary hover:bg-secondary hover:text-white",
				outlinesuccess:
					"border border-success bg-transparent text-success hover:bg-success hover:text-white",
				outlinewarning:
					"border border-warning bg-transparent text-warning hover:bg-warning hover:text-white",
				outlineinfo: "border border-info bg-transparent text-info hover:bg-info hover:text-white",
				outlineerror: "border border-error bg-transparent text-error hover:bg-error hover:text-white",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/85",
				success: "bg-success text-white hover:bg-successemphasis",
				warning: "bg-warning text-white hover:bg-warningemphasis",
				info: "bg-info text-white hover:bg-infoemphasis",
				error: "bg-error text-white hover:bg-erroremphasis",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				ghostprimary: "text-primary hover:bg-lightprimary hover:text-primary",
				ghostsecondary: "text-secondary hover:bg-lightsecondary hover:text-secondary",
				ghostsuccess: "text-success hover:bg-lightsuccess hover:text-success",
				ghostwarning: "text-warning hover:bg-lightwarning hover:text-warning",
				ghosterror: "text-error hover:bg-lighterror hover:text-error",
				ghostinfo: "text-info hover:bg-lightinfo hover:text-info",
				link: "text-primary underline-offset-4 hover:underline",
				lightprimary: "bg-lightprimary text-primary hover:bg-primary hover:text-white",
				lightsecondary: "bg-lightsecondary text-secondary hover:bg-secondary hover:text-white",
				lightsuccess: "bg-lightsuccess text-success hover:bg-success hover:text-white",
				lightwarning: "bg-lightwarning text-warning hover:bg-warning hover:text-white",
				lightinfo: "bg-lightinfo text-info hover:bg-info hover:text-white",
				lighterror: "bg-lighterror text-error hover:bg-error hover:text-white",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3",
				lg: "h-10 rounded-md px-7",
				icon: "h-9 w-9",
			},
			shape: {
				pill: "rounded-full",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, shape, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";

		return (
			<Comp
				className={cn(buttonVariants({ variant, size, shape, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
