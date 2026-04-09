"use client";

import { useFormStatus } from "react-dom";

import { Button, type ButtonProps } from "@/components/ui/button";

interface SubmitButtonProps extends ButtonProps {
	label: string;
	pendingLabel?: string;
}

export function SubmitButton({
	label,
	pendingLabel = "Guardando...",
	...props
}: SubmitButtonProps) {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending || props.disabled} {...props}>
			{pending ? pendingLabel : label}
		</Button>
	);
}

