"use client";

import { Button } from "@/components/ui/button";

interface ConfirmSubmitButtonProps {
  children: string;
  confirmMessage: string;
}

export function ConfirmSubmitButton({
  children,
  confirmMessage,
}: ConfirmSubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant="destructive"
      shape="pill"
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </Button>
  );
}
